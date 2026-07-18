import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
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
    authService = module.get<jest.Mocked<AuthService>>(AuthService);
  });

  it('should call authService.login', async () => {
    const loginDto = {
      email: 'test@test.com',
      password: '123456',
    };
    const user = {
      email: 'test@test.com',
    } as User;
    const spy = jest.spyOn(authService, 'login').mockResolvedValue(user);
    await controller.login(loginDto);
    expect(spy).toHaveBeenCalledWith(loginDto);
  });
});
