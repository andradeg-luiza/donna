import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Invalid Assistant Key', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 403 when assistant key is invalid', async () => {
    await spec()
      .post('/users')
      .withHeaders({
        'x-assistant-key': 'CHAVE_ERRADA',
      })
      .withBody({
        name: 'Teste',
        phone: '11944443333',
      })
      .expectStatus(403)
      .expectJsonLike({
        success: false,
        error: { code: 403 },
      });
  });
});
