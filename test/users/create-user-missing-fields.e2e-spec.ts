import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Users - Missing Fields', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 400 when name is missing', async () => {
    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({
        phone: '11977776666',
      })
      .expectStatus(400);
  });

  it('should return 400 when phone is missing', async () => {
    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({
        name: 'Fulano',
      })
      .expectStatus(400);
  });
});
