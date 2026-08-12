import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { LoginDto, UserDto } from 'dtos';
import { AuthContext } from './auth.context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const syncAuthState = async ({
    showLoader = true,
  }: { showLoader?: boolean } = {}) => {
    if (showLoader) {
      setLoading(true);
    }

    const updateAuthState = (user: UserDto | null) => {
      setUser(user);
      setIsAuthenticated(true);
    };

    try {
      updateAuthState(await authService.getCurrentUser());
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inittializeAuth = async () => {
      await syncAuthState({ showLoader: false });
    };
    inittializeAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    await authService.login(credentials);
    await syncAuthState({ showLoader: false });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, syncAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
