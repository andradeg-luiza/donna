import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Duplicate User', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 409 when creating a user with an existing phone', async () => {
    const phone = '11988887777';

    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ name: 'João', phone })
      .expectStatus(201);

    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ name: 'João', phone })
      .expectStatus(409)
      .expectJsonLike({
        success: false,
        error: { code: 409 },
      });
  });
});
