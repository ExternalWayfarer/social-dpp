import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";


interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserContextProfile {
  nickname: string | null;
  user_bio?: string | null; 
  user_avatar?: string | null;
}

export interface User {
  id: number;
  email: string;
  profile: UserContextProfile | null; 
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string; 
  groups?: string[]; 
}

interface AuthContextProps {
  accessToken: string | null;
  login: (tokens: AuthTokens) => void; 
  logout: () => void;
  user: User | null;
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


const fetchUserData = async (): Promise<User> => {
  const response = await api.get<User>('/users/me/');
  return response.data;
};






export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children,}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  



  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    
      try {
          const userData = await fetchUserData();
          setUser(userData);      
      } catch (error) {
        console.error("auth context: Failed to fetch user data with stored token:", error);
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } else {
      setAccessToken(null);
      setUser(null);
    }
    setIsLoading(false);
     }, []); // empty array

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);




  // cover login in useCallback so link wont be changed without necessary
  const login = useCallback(async(tokens: AuthTokens) => {
    try {
      console.log("Saving tokens:", tokens);
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
      setAccessToken(tokens.access); // update state 
      const userData = await fetchUserData(); // loading user data with new tiken
      setUser(userData);
      //
    } catch (error) {
      console.error("Failed to save tokens to localStorage", error);
      // handling saving error
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      throw error;
    }
  }, []);

  // cover logout in useCallback
const logout = useCallback(() => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error("AuthContext: Failed to remove tokens from localStorage during logout:", error);
    }
  }, []);

  const contextValue: AuthContextProps = {
    accessToken,
    login,
    logout,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading ? children : <p>check-up authentication...</p>}
    </AuthContext.Provider>
  );
};

// hook useAuth stays without changes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};