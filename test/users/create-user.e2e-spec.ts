import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Create User', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should create a user successfully', async () => {
    await spec()
      .post('/users')
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .withBody({
        name: 'Maria Silva',
        phone: '11999999999',
      })
      .expectStatus(201)
      .expectJsonLike({
        id: /\w+/,
        name: 'Maria Silva',
        phone: '11999999999',
      });
  });
});
