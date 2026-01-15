import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('E2E — Task Items', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let taskId: string;
  let itemId: string;

  // Massa única para o usuário principal
  const unique = `${process.pid}_${Date.now()}`;
  const email = `items_${unique}@example.com`;
  const phone = `81${Math.floor(100000000 + Math.random() * 899999999)}`;

  // Massa única para o segundo usuário
  const otherUnique = `${process.pid}_${Date.now()}_other`;
  const otherEmail = `other_items_${otherUnique}@example.com`;
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

    // -----------------------------------------------------
    // CRIAR TASK PARA OS ITENS
    // -----------------------------------------------------
    const task = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task para itens',
      })
      .expect(201);

    taskId = task.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  it('should create a task item', async () => {
    const res = await request(app.getHttpServer())
      .post('/task-items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Primeiro item',
        taskId,
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Primeiro item');

    itemId = res.body.id;
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  it('should list all items for a task', async () => {
    const res = await request(app.getHttpServer())
      .get(`/task-items/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  it('should update a task item', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/task-items/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Item atualizado',
      })
      .expect(200);

    expect(res.body.title).toBe('Item atualizado');
  });

  // -----------------------------------------------------
  // DELETE
  // -----------------------------------------------------
  it('should delete a task item', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/task-items/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  // -----------------------------------------------------
  // 404 — Item inexistente
  // -----------------------------------------------------
  it('should return 404 for non-existing item', async () => {
    await request(app.getHttpServer())
      .patch('/task-items/nonexistent-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x' })
      .expect(404);
  });

  // -----------------------------------------------------
  // 403 — Tentativa de acessar item de outro usuário
  // -----------------------------------------------------
  it('should return 403 when accessing another user item', async () => {
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

    // Criar task do outro usuário
    const otherTask = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        title: 'Task secreta',
      })
      .expect(201);

    // Criar item do outro usuário
    const otherItem = await request(app.getHttpServer())
      .post('/task-items')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        title: 'Item secreto',
        taskId: otherTask.body.id,
      })
      .expect(201);

    // Tentar acessar com o primeiro usuário
    await request(app.getHttpServer())
      .patch(`/task-items/${otherItem.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'hack' })
      .expect(403);
  });
});
