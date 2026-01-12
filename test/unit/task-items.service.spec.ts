import { Test, TestingModule } from '@nestjs/testing';
import { TaskItemsService } from '../../src/task-items/task-items.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../prisma/prisma-mock';
import { NotFoundException } from '@nestjs/common';

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

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  describe('create', () => {
    it('should create an item when task belongs to user', async () => {
      prisma.task.findFirst.mockResolvedValue({ id: 'task1', userId: 'user1' });

      prisma.taskItem.create.mockResolvedValue({
        id: 'item1',
        title: 'Comprar pão',
        taskId: 'task1',
      });

      const result = await service.create('user1', {
        title: 'Comprar pão',
        taskId: 'task1',
      });

      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: 'task1', userId: 'user1' },
      });

      expect(result).toHaveProperty('id');
    });

    it('should throw if task does not belong to user', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(
        service.create('user1', {
          title: 'Comprar pão',
          taskId: 'task1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  describe('findAll', () => {
    it('should list items of a task', async () => {
      prisma.task.findFirst.mockResolvedValue({ id: 'task1', userId: 'user1' });

      prisma.taskItem.findMany.mockResolvedValue([
        { id: 'item1', title: 'A' },
        { id: 'item2', title: 'B' },
      ]);

      const result = await service.findAll('user1', 'task1');

      expect(result.length).toBe(2);
      expect(prisma.taskItem.findMany).toHaveBeenCalledWith({
        where: { taskId: 'task1' },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('should throw if task does not belong to user', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.findAll('user1', 'task1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  describe('update', () => {
    it('should update an item when it belongs to user', async () => {
      prisma.taskItem.findFirst.mockResolvedValue({
        id: 'item1',
        taskId: 'task1',
        task: { userId: 'user1' },
      });

      prisma.taskItem.update.mockResolvedValue({
        id: 'item1',
        title: 'Novo título',
      });

      const result = await service.update('user1', 'item1', {
        title: 'Novo título',
      });

      expect(result.title).toBe('Novo título');
    });

    it('should throw if item does not belong to user', async () => {
      prisma.taskItem.findFirst.mockResolvedValue(null);

      await expect(
        service.update('user1', 'item1', { title: 'Novo' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  describe('remove', () => {
    it('should remove an item when it belongs to user', async () => {
      prisma.taskItem.findFirst.mockResolvedValue({
        id: 'item1',
        taskId: 'task1',
        task: { userId: 'user1' },
      });

      prisma.taskItem.delete.mockResolvedValue({});

      const result = await service.remove('user1', 'item1');

      expect(prisma.taskItem.delete).toHaveBeenCalledWith({
        where: { id: 'item1' },
      });

      expect(result).toEqual({ message: 'Item removido com sucesso.' });
    });

    it('should throw if item does not belong to user', async () => {
      prisma.taskItem.findFirst.mockResolvedValue(null);

      await expect(service.remove('user1', 'item1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
