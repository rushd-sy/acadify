import { useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { LoginDto, UserDto } from 'dtos';
import { AuthContext } from './auth.context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async (showLoad: boolean = true) => {
    if (showLoad) {
      setLoading(true);
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    await authService.login(credentials);
    await refreshUser(false);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
