import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../prisma/prisma-mock';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: typeof prismaMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  const mockAppointment = {
    id: 'app1',
    description: 'Consulta',
    scheduledAt: new Date(),
    userId: 'user1',
  };

  describe('findOne', () => {
    it('should return an appointment', async () => {
      prisma.appointment.findUnique.mockResolvedValue(mockAppointment);

      const result = await service.findOne('user1', 'app1');

      expect(result).toEqual(mockAppointment);
    });

    it('should throw 404 if appointment does not exist', async () => {
      prisma.appointment.findUnique.mockResolvedValue(null);

      await expect(service.findOne('user1', 'app1')).rejects.toThrow(NotFoundException);
    });

    it('should throw 403 if appointment belongs to another user', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        ...mockAppointment,
        userId: 'other',
      });

      await expect(service.findOne('user1', 'app1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      prisma.appointment.findUnique.mockResolvedValue(mockAppointment);
      prisma.appointment.update.mockResolvedValue({
        ...mockAppointment,
        description: 'Atualizado',
      });

      const result = await service.update('user1', 'app1', { description: 'Atualizado' });

      expect(result.description).toBe('Atualizado');
    });
  });

  describe('remove', () => {
    it('should remove an appointment', async () => {
      prisma.appointment.findUnique.mockResolvedValue(mockAppointment);
      prisma.appointment.delete.mockResolvedValue({});

      const result = await service.remove('user1', 'app1');

      expect(result).toEqual({ message: 'Compromisso removido com sucesso.' });
    });
  });
});
