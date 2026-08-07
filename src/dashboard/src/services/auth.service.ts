import type { LoginDto } from 'dtos';
import { authSessionService } from './auth-session.service';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (credentials: LoginDto): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let errorMessage = 'Can not login in.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.log(e);
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    authSessionService.setAuthenticated(true);
    return data;
  },

  checkSession: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/test`, {
        method: 'GET',
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // TODO: Placeholder for logout implementation

  logout: async () => {
    // TODO: Implement logout logic(clear tokens)
    return Promise.resolve();
  },
};
