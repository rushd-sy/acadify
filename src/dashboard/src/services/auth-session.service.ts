const TOKEN_KEY = 'accessToken';

export const authSessionService = {
  storeToken: (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },
};
