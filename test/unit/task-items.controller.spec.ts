import { Test, TestingModule } from '@nestjs/testing';
import { TaskItemsController } from '../../src/task-items/task-items.controller';
import { TaskItemsService } from '../../src/task-items/task-items.service';

describe('TaskItemsController', () => {
  let controller: TaskItemsController;
  let service: jest.Mocked<TaskItemsService>;

  const mockTaskItemsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<TaskItemsService>;

  const mockUser = { id: 'user1' };

  // Item completo para satisfazer o tipo do Prisma
  const mockItem = {
    id: 'item1',
    title: 'Comprar pão',
    taskId: 'task1',
    done: false, // campo obrigatório
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskItemsController],
      providers: [{ provide: TaskItemsService, useValue: mockTaskItemsService }],
    }).compile();

    controller = module.get<TaskItemsController>(TaskItemsController);
    service = module.get(TaskItemsService);

    jest.clearAllMocks();
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  describe('create', () => {
    it('should call TaskItemsService.create with correct params', async () => {
      service.create.mockResolvedValue(mockItem);

      const dto = { title: 'Comprar pão', taskId: 'task1' };
      const result = await controller.create(mockUser, dto as any);

      expect(service.create).toHaveBeenCalledWith('user1', dto);
      expect(result).toEqual(mockItem);
    });
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  describe('findAll', () => {
    it('should call TaskItemsService.findAll', async () => {
      service.findAll.mockResolvedValue([mockItem]);

      const result = await controller.findAll(mockUser, 'task1');

      expect(service.findAll).toHaveBeenCalledWith('user1', 'task1');
      expect(result).toEqual([mockItem]);
    });
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  describe('update', () => {
    it('should call TaskItemsService.update', async () => {
      const updatedItem = { ...mockItem, title: 'Atualizado' };
      service.update.mockResolvedValue(updatedItem);

      const dto = { title: 'Atualizado' };
      const result = await controller.update(mockUser, 'item1', dto as any);

      expect(service.update).toHaveBeenCalledWith('user1', 'item1', dto);
      expect(result).toEqual(updatedItem);
    });
  });

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  describe('remove', () => {
    it('should call TaskItemsService.remove', async () => {
      const response = { message: 'Item removido com sucesso.' };
      service.remove.mockResolvedValue(response);

      const result = await controller.remove(mockUser, 'item1');

      expect(service.remove).toHaveBeenCalledWith('user1', 'item1');
      expect(result).toEqual(response);
    });
  });
});
