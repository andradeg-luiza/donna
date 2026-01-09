import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Invalid Phone', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 400 for invalid phone number', async () => {
    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({
        name: 'Teste',
        phone: '123',
      })
      .expectStatus(400)
      .expectJsonLike({
        success: false,
        error: { code: 400 },
      });
  });
});
