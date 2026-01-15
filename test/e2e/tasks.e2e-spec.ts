import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('E2E — Tasks', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let taskId: string;

  // Massa única para este arquivo
  const unique = `${process.pid}_${Date.now()}`;
  const email = `tasks_${unique}@example.com`;
  const phone = `81${Math.floor(100000000 + Math.random() * 899999999)}`;

  // Massa única para o segundo usuário
  const otherUnique = `${process.pid}_${Date.now()}_other`;
  const otherEmail = `other_${otherUnique}@example.com`;
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
  it('should create a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Minha primeira task',
        description: 'Descrição da task',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Minha primeira task');

    taskId = res.body.id;
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  it('should list all tasks', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  it('should get a single task', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.id).toBe(taskId);
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  it('should update a task', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task atualizada',
      })
      .expect(200);

    expect(res.body.title).toBe('Task atualizada');
  });

  // -----------------------------------------------------
  // DELETE
  // -----------------------------------------------------
  it('should delete a task', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  // -----------------------------------------------------
  // 404 — Task inexistente
  // -----------------------------------------------------
  it('should return 404 for non-existing task', async () => {
    await request(app.getHttpServer())
      .get('/tasks/nonexistent-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  // -----------------------------------------------------
  // 403 — Tentativa de acessar task de outro usuário
  // -----------------------------------------------------
  it('should return 403 when accessing another user task', async () => {
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

    // Criar task com o segundo usuário
    const otherTask = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        title: 'Task secreta',
      })
      .expect(201);

    // Tentar acessar com o primeiro usuário
    await request(app.getHttpServer())
      .get(`/tasks/${otherTask.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
