import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('E2E — Auth', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Massa única para este arquivo
  const unique = `${process.pid}_${Date.now()}`;
  const email = `auth_${unique}@example.com`;
  const phone = `81${Math.floor(100000000 + Math.random() * 899999999)}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // -----------------------------------------------------
  // SIGNUP
  // -----------------------------------------------------
  it('should signup a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: '123456',
        phone,
      })
      .expect(201);

    expect(res.body).toHaveProperty('userId');
  });

  // -----------------------------------------------------
  // LOGIN + MFA
  // -----------------------------------------------------
  it('should login the user', async () => {
    // 1. Login inicial — MFA requerido
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: '123456',
      })
      .expect(200);

    expect(login.body.mfaRequired).toBe(true);

    // 2. Buscar código MFA no banco
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found during MFA verification');
    }

    const code = user.mfaCode;

    // 3. Verificar MFA → obter accessToken
    const verify = await request(app.getHttpServer())
      .post('/auth/verify-mfa')
      .send({
        email,
        code,
      })
      .expect(200);

    expect(verify.body).toHaveProperty('accessToken');
  });
});
