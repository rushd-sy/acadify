import { LoginDto, UserDto, LoginResultDto } from 'dtos';

export interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginDto) => Promise<LoginResultDto>;
  logout: () => Promise<void>;
  syncAuthState: (options?: { showLoader?: boolean }) => Promise<void>;
}
