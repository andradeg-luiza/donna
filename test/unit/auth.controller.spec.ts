import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    verifyMfa: jest.fn(),
  } as unknown as jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);

    jest.clearAllMocks();
  });

  // -----------------------------------------------------
  // REGISTER
  // -----------------------------------------------------
    describe('register', () => {
    it('should call AuthService.register', async () => {
        service.register.mockResolvedValue({
        message: 'Usuário registrado com sucesso.',
        userId: '1',
        });

        const dto = { email: 'a@a.com', password: '123', phone: '999' };
        const result = await controller.register(dto as any);

        expect(service.register).toHaveBeenCalledWith(dto);
        expect(result).toEqual({
        message: 'Usuário registrado com sucesso.',
        userId: '1',
        });
    });
    });


  // -----------------------------------------------------
  // LOGIN
  // -----------------------------------------------------
  describe('login', () => {
    it('should call AuthService.login', async () => {
      service.login.mockResolvedValue({ accessToken: 'token' });

      const dto = { email: 'a@a.com', password: '123' };
      const result = await controller.login(dto as any);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });

  // -----------------------------------------------------
  // VERIFY MFA
  // -----------------------------------------------------
  describe('verifyMfa', () => {
    it('should call AuthService.verifyMfa', async () => {
      service.verifyMfa.mockResolvedValue({ accessToken: 'token' });

      const dto = { email: 'a@a.com', code: '123456' };
      const result = await controller.verifyMfa(dto as any);

      expect(service.verifyMfa).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });

  // -----------------------------------------------------
  // GET ME
  // -----------------------------------------------------
  describe('getMe', () => {
    it('should return req.user', () => {
      const req = { user: { id: '1', email: 'a@a.com' } } as any;

      const result = controller.getMe(req);

      expect(result).toEqual(req.user);
    });
  });
});
