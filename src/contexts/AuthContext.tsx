import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenManager, User, usersAPI } from '@/services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type RawRole = 'ADMIN' | 'STUDENT' | 'TEACHER' | 'ROLE_ADMIN' | 'ROLE_STUDENT' | 'ROLE_TEACHER';
type NormalizedRole = 'ADMIN' | 'STUDENT' | 'TEACHER';

const normalizeRole = (role: RawRole): NormalizedRole => {
  return role.startsWith('ROLE_')
    ? (role.replace('ROLE_', '') as NormalizedRole)
    : role;
};

interface JWTPayload {
  sub: string; // email
  role: RawRole;
  exp: number;
  iat: number;
  id?: number; // optional backend claim
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserFromToken = async (token: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        tokenManager.removeToken();
        setIsLoading(false);
        return;
      }

      let resolvedUser: User = {
        id: decoded.id ?? 0,
        email: decoded.sub,
        role: normalizeRole(decoded.role),
        status: 'ACTIVE',
      };

      try {
        const profile = await usersAPI.search(decoded.sub);
        resolvedUser = {
          id: profile.id,
          email: profile.email,
          role: normalizeRole(profile.role),
          status: profile.status || 'ACTIVE',
        };
      } catch (error) {
        console.warn('Unable to load user profile from /users/search, continuing with token data', error);
      }

      setUser(resolvedUser);
    } catch (error) {
      console.error('Invalid token:', error);
      tokenManager.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing token on mount
    const token = tokenManager.getToken();
    if (token) {
      loadUserFromToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    tokenManager.setToken(response.token);
    await loadUserFromToken(response.token);
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
