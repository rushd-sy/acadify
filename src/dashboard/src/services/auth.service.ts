import type { LoginDto } from 'dtos';
import { api } from '../lib/api-client';
import { AxiosError } from 'axios';

export const authService = {
  login: async (credentials: LoginDto): Promise<{ message: string }> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      let errorMessage = 'An error occurred during login.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage, { cause: error });
    }
  },

  checkSession: async (): Promise<boolean> => {
    try {
      const response = await api.get('/auth/test');
      return response.status === 200;
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
