import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Missing Assistant Key', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 403 when assistant key is missing', async () => {
    await spec()
      .post('/users')
      .withBody({
        name: 'Teste',
        phone: '11955554444',
      })
      .expectStatus(403)
      .expectJsonLike({
        success: false,
        error: { code: 403 },
      });
  });
});
