import { spec } from 'pactum';
import { setupTestApp, closeTestApp, resetDatabase } from '../utils/test-setup';

describe('Tasks - Delete Task', () => {
  beforeAll(async () => {
    await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('should delete a task', async () => {
    const phone = '11944445555';

    await spec()
      .post('/users')
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ name: 'Daniel', phone })
      .expectStatus(201);

    const task = await spec()
      .post(`/tasks/${phone}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .withBody({ title: 'Cortar cabelo', description: 'Barbearia às 15h' })
      .expectStatus(201);

    const id = task.body.id;

    await spec()
      .delete(`/tasks/${id}`)
      .withHeaders({ 'x-assistant-key': process.env.ASSISTANT_KEY })
      .expectStatus(200)
      .expectJsonLike({ success: true });
  });
});
