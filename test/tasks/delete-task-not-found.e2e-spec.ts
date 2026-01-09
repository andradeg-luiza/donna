import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - Delete Task Not Found', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 404 when deleting a non-existing task', async () => {
    await spec()
      .delete('/tasks/999999')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .expectStatus(404);
  });
});
