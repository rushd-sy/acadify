import axios from 'axios';
import { router } from '../router';

export const api = axios.create({
  baseURL: import.meta.env.VIT_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      router.navigate('/login');
    }
    return Promise.reject(error);
  },
);
