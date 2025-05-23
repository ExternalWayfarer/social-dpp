import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Data from API /api/token/
interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  id: number;
  email: string;
  // profile
  // nickname?: string;
}

interface AuthContextProps {
  //  store token itself or null
  accessToken: string | null; 
  login: (tokens: AuthTokens) => void; // login now accept  tokens
  logout: () => void;
  user: User | null;
  isLoading: boolean; /// Add loading state for first check
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // state for token and starting loading or cheking
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true by default, until check localStorage
  const [user, setUser] = useState<User | null>(null);
  // verification func when app is loading
  useEffect(() => {
    try {
      const storedAccessToken = localStorage.getItem('accessToken');
      if (storedAccessToken) {
        // TODO: 
        // add check if token valid or make a request to /api/user/me/ for approval
        // if not valid : logout().
        setAccessToken(storedAccessToken);
      }
    } catch (error) {
      console.error("Failed to load token from localStorage", error);
      // if error then token null
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false); // loading is complete
    }
  }, []); // empty array

  // cover login in useCallback so link wont be changed without necessary 
  const login = useCallback((tokens: AuthTokens) => {
    try {
        console.log("Saving tokens:", tokens);
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        setAccessToken(tokens.access); // update state in Context
        // 
    } catch (error) {
        console.error("Failed to save tokens to localStorage", error);
        // handling saving error
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
  }, []);

  // cover logout in useCallback
  const logout = useCallback(() => {
    try {
        console.log("Logging out and removing tokens");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null); 
    } catch (error) {
        console.error("Failed to remove tokens from localStorage", error);
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
      
      {!isLoading ? children : null }
    </AuthContext.Provider>
  );
};

// hook useAuth stays without changes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};