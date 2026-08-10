import { redirect } from 'react-router-dom';
import { authSessionService } from '@/services/auth-session.service';

export const requireAuthLoader = async () => {
  const isAuth = await authSessionService.isAuthenticated();

  if (!isAuth) {
    throw redirect('/login');
  }
  return null;
};
