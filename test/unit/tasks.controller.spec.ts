import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../../src/tasks/tasks.controller';
import { TasksService } from '../../src/tasks/tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<TasksService>;

  const mockUser = { id: 'user1' };

  // Task completa para satisfazer o tipo do Prisma
  const mockTask = {
    id: '1',
    title: 'Test',
    description: null,
    done: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: null,
    priority: null,
    userId: 'user1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);

    jest.clearAllMocks();
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  describe('create', () => {
    it('should call TasksService.create with correct params', async () => {
      service.create.mockResolvedValue(mockTask);

      const dto = { title: 'Test', description: 'desc' };
      const result = await controller.create(mockUser, dto as any);

      expect(service.create).toHaveBeenCalledWith('user1', dto);
      expect(result).toEqual(mockTask);
    });
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  describe('findAll', () => {
    it('should call TasksService.findAll', async () => {
      service.findAll.mockResolvedValue([mockTask]);

      const result = await controller.findAll(mockUser);

      expect(service.findAll).toHaveBeenCalledWith('user1');
      expect(result).toEqual([mockTask]);
    });
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  describe('findOne', () => {
    it('should call TasksService.findOne', async () => {
      service.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(mockUser, '1');

      expect(service.findOne).toHaveBeenCalledWith('user1', '1');
      expect(result).toEqual(mockTask);
    });
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  describe('update', () => {
    it('should call TasksService.update', async () => {
      const updatedTask = { ...mockTask, title: 'Updated' };
      service.update.mockResolvedValue(updatedTask);

      const dto = { title: 'Updated' };
      const result = await controller.update(mockUser, '1', dto as any);

      expect(service.update).toHaveBeenCalledWith('user1', '1', dto);
      expect(result).toEqual(updatedTask);
    });
  });

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  describe('remove', () => {
    it('should call TasksService.remove', async () => {
      const response = { message: 'Task removida com sucesso.' };
      service.remove.mockResolvedValue(response);

      const result = await controller.remove(mockUser, '1');

      expect(service.remove).toHaveBeenCalledWith('user1', '1');
      expect(result).toEqual(response);
    });
  });
});
