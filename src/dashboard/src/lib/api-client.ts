import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VIT_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
