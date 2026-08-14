import type { LoginDto } from 'dtos';
import { api } from '../lib/api-client';

export const authService = {
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  login: async (credentials: LoginDto) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // TODO: Placeholder for logout implementation

  logout: async () => {
    // TODO: Implement logout logic(clear tokens)
    return Promise.resolve();
  },
};
