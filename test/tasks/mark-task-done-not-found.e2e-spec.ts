import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - Mark Task Done Not Found', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 404 when task does not exist', async () => {
    await spec()
      .post('/tasks/done/999999')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .expectStatus(404);
  });
});
