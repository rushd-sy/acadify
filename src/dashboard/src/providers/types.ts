import { LoginDto, UserDto } from 'dtos';

export interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
