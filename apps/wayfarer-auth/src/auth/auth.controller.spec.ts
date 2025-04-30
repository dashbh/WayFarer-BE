import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HttpResponse, UserEntity, RegisterDto } from '@wayfarer/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authServiceMock: AuthService;
  let userServiceMock: UserService;

  beforeEach(async () => {
    authServiceMock = {
      validateUser: jest.fn(),
      login: jest.fn(),
      validateJWT: jest.fn(),
    } as any;

    userServiceMock = {
      registerUser: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if user is valid', async () => {
      const mockUser = { id: 1, username: 'testuser' } as UserEntity;
      const mockToken = { accessToken: 'mocked-token' };

      (authServiceMock.validateUser as jest.Mock).mockResolvedValue(mockUser);
      (authServiceMock.login as jest.Mock).mockResolvedValue(mockToken);

      const result = await authController.login({
        username: 'testuser',
        password: 'password',
      });

      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        'testuser',
        'password',
      );
      expect(authServiceMock.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockToken);
    });

    xit('should return an error response if credentials are invalid', async () => {
      (authServiceMock.validateUser as jest.Mock).mockResolvedValue(null);

      const result = await authController.login({
        username: 'testuser',
        password: 'wrongpassword',
      });

      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        'testuser',
        'wrongpassword',
      );
      expect(result).toEqual(
        HttpResponse.error('Invalid credentials', 'Unauthorized', 401),
      );
    });
  });

  describe('validateUser', () => {
    it('should call validateJWT and return the result', async () => {
      const mockPayload = { id: 1, username: 'testuser' };
      const mockValidatedUser = { id: 1, username: 'testuser', role: 'user' };

      (authServiceMock.validateJWT as jest.Mock).mockResolvedValue(
        mockValidatedUser,
      );

      const result = await authController.validateUser(mockPayload);

      expect(authServiceMock.validateJWT).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockValidatedUser);
    });
  });

  describe('registerUser', () => {
    it('should register a user and return the created user', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        password: 'securepassword',
      };

      const mockUser: UserEntity = {
        id: 1,
        username: 'newuser',
        role: 'newuser@example.com',
        password: 'hashedpassword',
      } as UserEntity;

      (userServiceMock.registerUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await authController.registerUser(registerDto);

      expect(userServiceMock.registerUser).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUser);
    });
  });
});
