import axios, { InternalAxiosRequestConfig, AxiosError  } from 'axios';

const api = axios.create({
baseURL: 'http://localhost:8000/api/', //backend URL 
 // headers: {
  //   'Content-Type': 'application/json', // json
  // }
})

const NO_AUTH_HEADER_PATHS = [
  'auth/token/',          
  'auth/token/refresh/',  
  'auth/register/',       // reg

];


// ------- request interceptor -------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    // function calls before every request using api
    let isAuthPath = false;
    if (config.url) {

      isAuthPath = NO_AUTH_HEADER_PATHS.some(pathPrefix => config.url!.startsWith(pathPrefix));
    }
    

    // 2. if token true add in header
    if (token && !isAuthPath) {

      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ------ request interceptor ends here-----








// ----- response interceptor -------
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processFailedQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/auth/token/refresh/') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return api(originalRequest); 
          })
          .catch(err => {
            return Promise.reject(err); 
          });
      }

      originalRequest._retry = true; 
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
       
        console.error("No refresh token available, logging out.");
        window.dispatchEvent(new Event('forceLogout'));
        isRefreshing = false;
        processFailedQueue(new Error("No refresh token"), null);
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${api.defaults.baseURL}auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        
        // update header
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        
        isRefreshing = false;
        processFailedQueue(null, newAccessToken); 
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        isRefreshing = false;
        processFailedQueue(refreshError as Error, null); 
        // if update doesn't succeeded  => logout
        window.dispatchEvent(new Event('forceLogout'));
        return Promise.reject(refreshError);
      }
    }

    // other errors just return
    return Promise.reject(error);
  }
);
// ------ response interceptor ends here -------


export default api;