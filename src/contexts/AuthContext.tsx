import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenManager, User } from '@/services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JWTPayload {
  sub: string; // email
  role: 'ADMIN' | 'STUDENT' | 'TEACHER';
  exp: number;
  iat: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = tokenManager.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          tokenManager.removeToken();
          setIsLoading(false);
          return;
        }

        setUser({
          id: 0, // We don't have ID in JWT, will be fetched if needed
          email: decoded.sub,
          role: decoded.role,
          status: 'ACTIVE',
        });
      } catch (error) {
        console.error('Invalid token:', error);
        tokenManager.removeToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    tokenManager.setToken(response.token);
    
    const decoded = jwtDecode<JWTPayload>(response.token);
    console.log(decoded)
    setUser({
      id: 0,
      email: decoded.sub,
      role: decoded.role,
      status: 'ACTIVE',
    });
  };

  const logout = () => {
    tokenManager.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
