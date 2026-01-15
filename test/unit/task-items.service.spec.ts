import { Test, TestingModule } from '@nestjs/testing';
import { TaskItemsService } from '../../src/task-items/task-items.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../prisma/prisma-mock';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TaskItemsService', () => {
  let service: TaskItemsService;
  let prisma: typeof prismaMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskItemsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TaskItemsService>(TaskItemsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an item when task belongs to user', async () => {
      prisma.task.findUnique.mockResolvedValue({ id: 'task1', userId: 'user1' });

      prisma.taskItem.create.mockResolvedValue({
        id: 'item1',
        title: 'Comprar pão',
        taskId: 'task1',
      });

      const result = await service.create('user1', {
        title: 'Comprar pão',
        taskId: 'task1',
      });

      expect(result.id).toBe('item1');
    });

    it('should throw if task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(
        service.create('user1', { title: 'X', taskId: 'task1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if task belongs to another user', async () => {
      prisma.task.findUnique.mockResolvedValue({ id: 'task1', userId: 'other' });

      await expect(
        service.create('user1', { title: 'X', taskId: 'task1' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should list items of a task', async () => {
      prisma.task.findUnique.mockResolvedValue({ id: 'task1', userId: 'user1' });

      prisma.taskItem.findMany.mockResolvedValue([
        { id: 'item1', title: 'A' },
        { id: 'item2', title: 'B' },
      ]);

      const result = await service.findAll('user1', 'task1');

      expect(result.length).toBe(2);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      prisma.taskItem.findUnique.mockResolvedValue({
        id: 'item1',
        task: { userId: 'user1' },
      });

      prisma.taskItem.update.mockResolvedValue({
        id: 'item1',
        title: 'Novo título',
      });

      const result = await service.update('user1', 'item1', { title: 'Novo título' });

      expect(result.title).toBe('Novo título');
    });
  });
});
