import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UserMapper } from '../mappers/user.mapper';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UserMapper,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should return a user dto', async () => {
    const loginDto = {
      email: 'test@test.com',
      password: '123456',
    };

    const user = {
      id: 1,
      fullName: 'Test User',
      email: 'test@test.com',
      hashedPassword: 'hashed-password',
    };

    authService.login.mockResolvedValue(user);
    const result = await controller.login(loginDto);
    expect(result).toEqual({
      id: 1,
      fullName: 'Test User',
      email: 'test@test.com',
    });
  });
});
