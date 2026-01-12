import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { prismaMock } from '../prisma/prisma-mock';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: typeof prismaMock;
  let jwt: typeof jwtMock;

  const jwtMock = {
    sign: jest.fn(),
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);

    jest.clearAllMocks();
  });

  // REGISTER
  describe('register', () => {
    it('should create a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: '1', email: 'a@a.com' });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await service.register({
        email: 'a@a.com',
        password: '123',
        phone: '999',
      });

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('userId');
      expect(result.userId).toBe('1');
    });

    it('should throw if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(
        service.register({
          email: 'a@a.com',
          password: '123',
          phone: '999',
        }),
      ).rejects.toThrow();
    });
  });

  // LOGIN
  describe('login', () => {
    it('should login successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'a@a.com',
        passwordHash: 'hashed',
        mfaEnabled: false,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await service.login({
        email: 'a@a.com',
        password: '123',
      });

      expect(result).toHaveProperty('accessToken');
    });

    it('should throw if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'a@a.com', password: '123' }),
      ).rejects.toThrow();
    });

    it('should throw if password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'a@a.com',
        passwordHash: 'hashed',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'a@a.com', password: '123' }),
      ).rejects.toThrow();
    });
  });

  // VERIFY MFA
  describe('verifyMfa', () => {
    it('should verify MFA successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        mfaEnabled: true,
        mfaCode: '123456',
        mfaExpiresAt: new Date(Date.now() + 10000),
      });

      jwt.sign.mockReturnValue('token');

      const result = await service.verifyMfa({
        email: 'a@a.com',
        code: '123456',
      });

      expect(result).toHaveProperty('accessToken');
    });

    it('should throw if code is invalid', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        mfaEnabled: true,
        mfaCode: '999999',
        mfaExpiresAt: new Date(Date.now() + 10000),
      });

      await expect(
        service.verifyMfa({ email: 'a@a.com', code: '123456' }),
      ).rejects.toThrow();
    });

    it('should throw if code expired', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        mfaEnabled: true,
        mfaCode: '123456',
        mfaExpiresAt: new Date(Date.now() - 10000),
      });

      await expect(
        service.verifyMfa({ email: 'a@a.com', code: '123456' }),
      ).rejects.toThrow();
    });
  });
});
