import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - Mark Task Done', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should mark a task as done', async () => {
    const phone = '11933334444';

    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ name: 'Beatriz', phone })
      .expectStatus(201);

    const task = await spec()
      .post(`/tasks/${phone}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ title: 'Lavar roupa', description: 'Usar sabão líquido' })
      .expectStatus(201);

    const id = task.body.id;

    await spec()
      .post(`/tasks/done/${id}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .expectStatus(200)
      .expectJsonLike({ done: true });
  });
});
