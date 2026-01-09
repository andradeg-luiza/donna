import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - Create Task', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should create a task for a valid user', async () => {
    // cria usuário
    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ name: 'Ana', phone: '11911112222' })
      .expectStatus(201);

    // cria task
    await spec()
      .post('/tasks/11911112222')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({
        title: 'Comprar pão',
        description: 'Ir na padaria às 8h',
      })
      .expectStatus(201)
      .expectJsonLike({
        id: /\w+/,
        title: 'Comprar pão',
        description: 'Ir na padaria às 8h',
      });
  });
});
