import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
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

  it('should return login result', async () => {
    const loginDto = {
      email: 'test@test.com',
      password: '123456',
    };

    const loginResult = {
      id: 1,
      email: 'test@test.com',
      accessToken: 'jwt-token',
    };

    authService.login.mockResolvedValue(loginResult);

    const result = await controller.login(loginDto);

    expect(result).toEqual(loginResult);
  });
});
