import { authService } from './auth.service';

let authenticated = false;
export const authSessionService = {
  clearSession: () => {
    authenticated = false;
  },

  restoreSession: async () => {
    const sessionIsValid = await authService.checkSession();
    authSessionService.setAuthenticated(sessionIsValid);
  },

  setAuthenticated: (value: boolean) => {
    authenticated = value;
  },

  isAuthenticated: () => {
    return authenticated;
  },
};
