import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { LoginDto, UserDto } from 'dtos';
import { AuthContext } from './auth.context';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api-client';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const resetAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          resetAuthState();
          navigate('/login', { replace: true });
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

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
      resetAuthState();
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
    const data = await authService.login(credentials);
    await syncAuthState({ showLoader: false });
    return data;
  };

  const logout = async () => {
    await authService.logout();
    resetAuthState();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, syncAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
