import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - List Tasks', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should list tasks for a user', async () => {
    const phone = '11922223333';

    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ name: 'Carlos', phone })
      .expectStatus(201);

    await spec()
      .post(`/tasks/${phone}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ title: 'Estudar', description: 'Revisar NestJS' })
      .expectStatus(201);

    await spec()
      .get(`/tasks/${phone}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .expectStatus(200)
      .expectJsonLike([
        {
          title: 'Estudar',
          description: 'Revisar NestJS',
        },
      ]);
  });
});
