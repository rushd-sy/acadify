import { authService } from './auth.service';

export const authSessionService = {
  isAuthenticated: async (): Promise<boolean> => {
    return await authService.checkSession();
  },
};
