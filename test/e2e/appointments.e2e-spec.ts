import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('E2E — Appointments', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let appointmentId: string;

  // Massa única para o usuário principal
  const unique = `${process.pid}_${Date.now()}`;
  const email = `appointments_${unique}@example.com`;
  const phone = `81${Math.floor(100000000 + Math.random() * 899999999)}`;

  // Massa única para o segundo usuário
  const otherUnique = `${process.pid}_${Date.now()}_other`;
  const otherEmail = `other_appointments_${otherUnique}@example.com`;
  const otherPhone = `81${Math.floor(100000000 + Math.random() * 899999999)}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // -----------------------------------------------------
    // SIGNUP
    // -----------------------------------------------------
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: '123456',
        phone,
      })
      .expect(201);

    // -----------------------------------------------------
    // LOGIN (MFA REQUIRED)
    // -----------------------------------------------------
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: '123456',
      })
      .expect(200);

    expect(login.body.mfaRequired).toBe(true);

    // Buscar código MFA no banco
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found during MFA verification');
    }

    const code = user.mfaCode;

    // -----------------------------------------------------
    // VERIFY MFA → TOKEN FINAL
    // -----------------------------------------------------
    const verify = await request(app.getHttpServer())
      .post('/auth/verify-mfa')
      .send({
        email,
        code,
      })
      .expect(200);

    token = verify.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  it('should create an appointment', async () => {
    const res = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Consulta médica',
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.description).toBe('Consulta médica');

    appointmentId = res.body.id;
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  it('should list all appointments', async () => {
    const res = await request(app.getHttpServer())
      .get('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  it('should get a single appointment', async () => {
    const res = await request(app.getHttpServer())
      .get(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.id).toBe(appointmentId);
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  it('should update an appointment', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Consulta atualizada',
      })
      .expect(200);

    expect(res.body.description).toBe('Consulta atualizada');
  });

  // -----------------------------------------------------
  // DELETE
  // -----------------------------------------------------
  it('should delete an appointment', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  // -----------------------------------------------------
  // 404 — Appointment inexistente
  // -----------------------------------------------------
  it('should return 404 for non-existing appointment', async () => {
    await request(app.getHttpServer())
      .get('/appointments/nonexistent-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  // -----------------------------------------------------
  // 403 — Tentativa de acessar appointment de outro usuário
  // -----------------------------------------------------
  it('should return 403 when accessing another user appointment', async () => {
    // Criar outro usuário
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: otherEmail,
        password: '123456',
        phone: otherPhone,
      })
      .expect(201);

    // LOGIN (MFA)
    const loginOther = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: otherEmail,
        password: '123456',
      })
      .expect(200);

    expect(loginOther.body.mfaRequired).toBe(true);

    const otherUser = await prisma.user.findUnique({
      where: { email: otherEmail },
    });

    if (!otherUser) {
      throw new Error('Other user not found during MFA verification');
    }

    const otherCode = otherUser.mfaCode;

    const verifyOther = await request(app.getHttpServer())
      .post('/auth/verify-mfa')
      .send({
        email: otherEmail,
        code: otherCode,
      })
      .expect(200);

    const otherToken = verifyOther.body.accessToken;

    // Criar appointment do outro usuário
    const otherAppointment = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        description: 'Consulta secreta',
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    // Tentar acessar com o primeiro usuário
    await request(app.getHttpServer())
      .get(`/appointments/${otherAppointment.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
