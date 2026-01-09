import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - List Users', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return an empty list when no users exist', async () => {
    await spec()
      .get('/users')
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .expectStatus(200)
      .expectJson([]);
  });

  it('should list users after creation', async () => {
    // cria um usuário
    await spec()
      .post('/users')
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .withBody({
        name: 'Ana',
        phone: '11911112222',
      })
      .expectStatus(201);

    // lista usuários
    await spec()
      .get('/users')
      .withHeaders({
        'x-assistant-key': process.env.ASSISTANT_KEY,
      })
      .expectStatus(200)
      .expectJsonLike([
        {
          name: 'Ana',
          phone: '11911112222',
        },
      ]);
  });
});
