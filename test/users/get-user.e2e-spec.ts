import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Get User by ID', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return a user by ID', async () => {
    // cria usuário
    const createRes = await spec()
      .post('/users')
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .withBody({
        name: 'Carlos',
        phone: '11922223333',
      })
      .expectStatus(201);

    const userId = createRes.body.id;

    // busca usuário
    await spec()
      .get(`/users/${userId}`)
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .expectStatus(200)
      .expectJsonLike({
        id: userId,
        name: 'Carlos',
        phone: '11922223333',
      });
  });

  it('should return 404 for non-existing user', async () => {
    await spec()
      .get('/users/999999')
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .expectStatus(404)
      .expectJsonLike({
        success: false,
        error: { code: 404 },
      });
  });
});
