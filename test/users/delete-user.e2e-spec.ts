import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Delete User', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should delete a user successfully', async () => {
    // cria usuário
    const createRes = await spec()
      .post('/users')
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .withBody({
        name: 'Beatriz',
        phone: '11933334444',
      })
      .expectStatus(201);

    const userId = createRes.body.id;

    // deleta usuário
    await spec()
      .delete(`/users/${userId}`)
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .expectStatus(200)
      .expectJsonLike({
        success: true,
      });

    // garante que não existe mais
    await spec()
      .get(`/users/${userId}`)
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .expectStatus(404);
  });

  it('should return 404 when deleting a non-existing user', async () => {
    await spec()
      .delete('/users/999999')
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
