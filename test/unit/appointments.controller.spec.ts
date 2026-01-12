import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from '../../src/appointments/appointments.controller';
import { AppointmentsService } from '../../src/appointments/appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: jest.Mocked<AppointmentsService>;

  const mockAppointmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<AppointmentsService>;

  const mockUser = { id: 'user1' };

  // Mock completo compatível com o Prisma
  const mockAppointment = {
    id: 'app1',
    description: 'Consulta médica',
    scheduledAt: new Date(),
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: mockAppointmentsService },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get(AppointmentsService);

    jest.clearAllMocks();
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  describe('create', () => {
    it('should call AppointmentsService.create with correct params', async () => {
      service.create.mockResolvedValue(mockAppointment);

      const dto = {
        description: 'Consulta médica',
        scheduledAt: new Date().toISOString(),
      };

      const result = await controller.create(mockUser, dto as any);

      expect(service.create).toHaveBeenCalledWith('user1', dto);
      expect(result).toEqual(mockAppointment);
    });
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  describe('findAll', () => {
    it('should call AppointmentsService.findAll', async () => {
      service.findAll.mockResolvedValue([mockAppointment]);

      const result = await controller.findAll(mockUser);

      expect(service.findAll).toHaveBeenCalledWith('user1');
      expect(result).toEqual([mockAppointment]);
    });
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  describe('findOne', () => {
    it('should call AppointmentsService.findOne', async () => {
      service.findOne.mockResolvedValue(mockAppointment);

      const result = await controller.findOne(mockUser, 'app1');

      expect(service.findOne).toHaveBeenCalledWith('user1', 'app1');
      expect(result).toEqual(mockAppointment);
    });
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  describe('update', () => {
    it('should call AppointmentsService.update', async () => {
      const updatedAppointment = {
        ...mockAppointment,
        description: 'Atualizado',
      };

      service.update.mockResolvedValue(updatedAppointment);

      const dto = { description: 'Atualizado' };
      const result = await controller.update(mockUser, 'app1', dto as any);

      expect(service.update).toHaveBeenCalledWith('user1', 'app1', dto);
      expect(result).toEqual(updatedAppointment);
    });
  });

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  describe('remove', () => {
    it('should call AppointmentsService.remove', async () => {
      const response = { message: 'Compromisso removido com sucesso.' };
      service.remove.mockResolvedValue(response);

      const result = await controller.remove(mockUser, 'app1');

      expect(service.remove).toHaveBeenCalledWith('user1', 'app1');
      expect(result).toEqual(response);
    });
  });
});
