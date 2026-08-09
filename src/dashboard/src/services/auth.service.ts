import type { LoginDto } from 'dtos';
import { apiClient } from '../lib/api-client';

export const authService = {
  login: async (credentials: LoginDto): Promise<{ message: string }> => {
    const response = await apiClient('/auth/login', {
      method: 'POST',
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

    return await response.json();
  },

  checkSession: async (): Promise<boolean> => {
    try {
      const response = await apiClient('/auth/test', {
        method: 'GET',
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
