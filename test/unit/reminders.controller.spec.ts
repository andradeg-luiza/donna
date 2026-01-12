import { Test, TestingModule } from '@nestjs/testing';
import { RemindersController } from '../../src/reminders/reminders.controller';
import { RemindersService } from '../../src/reminders/reminders.service';

describe('RemindersController', () => {
  let controller: RemindersController;
  let service: jest.Mocked<RemindersService>;

  const mockRemindersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<RemindersService>;

  const mockUser = { id: 'user1' };

  // Mock completo compatível com o Prisma
  const mockReminder = {
    id: 'rem1',
    taskId: null,
    appointmentId: null,
    userId: 'user1',
    remindAt: new Date(),          // ✔ Date
    message: 'Lembrete importante',
    sent: false,                   // ✔ obrigatório
    sentAt: null,                  // ✔ obrigatório
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemindersController],
      providers: [{ provide: RemindersService, useValue: mockRemindersService }],
    }).compile();

    controller = module.get<RemindersController>(RemindersController);
    service = module.get(RemindersService);

    jest.clearAllMocks();
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  describe('create', () => {
    it('should call RemindersService.create with correct params', async () => {
      service.create.mockResolvedValue(mockReminder);

      const dto = {
        message: 'Lembrete importante',
        remindAt: new Date().toISOString(),
        taskId: 'task1',
      };

      const result = await controller.create(mockUser, dto as any);

      expect(service.create).toHaveBeenCalledWith('user1', dto);
      expect(result).toEqual(mockReminder);
    });
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  describe('findAll', () => {
    it('should call RemindersService.findAll', async () => {
      service.findAll.mockResolvedValue([mockReminder]);

      const result = await controller.findAll(mockUser);

      expect(service.findAll).toHaveBeenCalledWith('user1');
      expect(result).toEqual([mockReminder]);
    });
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  describe('findOne', () => {
    it('should call RemindersService.findOne', async () => {
      service.findOne.mockResolvedValue(mockReminder);

      const result = await controller.findOne(mockUser, 'rem1');

      expect(service.findOne).toHaveBeenCalledWith('user1', 'rem1');
      expect(result).toEqual(mockReminder);
    });
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  describe('update', () => {
    it('should call RemindersService.update', async () => {
      const updatedReminder = { ...mockReminder, message: 'Atualizado' };
      service.update.mockResolvedValue(updatedReminder);

      const dto = { message: 'Atualizado' };
      const result = await controller.update(mockUser, 'rem1', dto as any);

      expect(service.update).toHaveBeenCalledWith('user1', 'rem1', dto);
      expect(result).toEqual(updatedReminder);
    });
  });

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  describe('remove', () => {
    it('should call RemindersService.remove', async () => {
      const response = { message: 'Lembrete removido com sucesso.' };
      service.remove.mockResolvedValue(response);

      const result = await controller.remove(mockUser, 'rem1');

      expect(service.remove).toHaveBeenCalledWith('user1', 'rem1');
      expect(result).toEqual(response);
    });
  });
});
