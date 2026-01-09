import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - Missing Fields', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should return 400 when title is missing', async () => {
    const phone = '11955556666';

    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ name: 'Eva', phone })
      .expectStatus(201);

    await spec()
      .post(`/tasks/${phone}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ description: 'Sem título' })
      .expectStatus(400);
  });

  it('should return 400 when description is missing', async () => {
    const phone = '11955556666';

    await spec()
      .post(`/tasks/${phone}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ title: 'Sem descrição' })
      .expectStatus(400);
  });
});
