import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set httpOnly cookie and return success message', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockAccessToken = 'mock-jwt-token-123';

      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ accessToken: mockAccessToken });

      const cookieMock = jest.fn();
      const mockResponse = {
        cookie: cookieMock,
      } as unknown as Response;

      const result = await controller.login(loginDto, mockResponse);

      expect(cookieMock).toHaveBeenCalledWith(
        'accessToken',
        mockAccessToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
        }),
      );

      expect(result).toEqual({ message: 'Login successful' });
    });
  });
});
