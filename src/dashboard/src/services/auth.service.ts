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

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
