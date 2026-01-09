import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - User Not Found', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 404 when user does not exist', async () => {
    await spec()
      .post('/tasks/11900001111')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ title: 'Teste', description: 'Teste' })
      .expectStatus(404);
  });
});
