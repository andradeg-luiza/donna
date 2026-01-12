import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../prisma/prisma-mock';
import { NotFoundException } from '@nestjs/common';

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

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  describe('create', () => {
    it('should create an appointment', async () => {
      prisma.appointment.create.mockResolvedValue({
        id: 'app1',
        description: 'Consulta médica',
        scheduledAt: '2025-01-01T10:00:00.000Z',
      });

      const result = await service.create('user1', {
        description: 'Consulta médica',
        scheduledAt: '2025-01-01T10:00:00.000Z',
      });

      expect(prisma.appointment.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  describe('findAll', () => {
    it('should return all appointments for a user', async () => {
      prisma.appointment.findMany.mockResolvedValue([
        { id: '1', description: 'A' },
        { id: '2', description: 'B' },
      ]);

      const result = await service.findAll('user1');

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { scheduledAt: 'asc' },
      });

      expect(result.length).toBe(2);
    });
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  describe('findOne', () => {
    it('should return an appointment', async () => {
      prisma.appointment.findFirst.mockResolvedValue({
        id: 'app1',
        description: 'Teste',
      });

      const result = await service.findOne('user1', 'app1');

      expect(result).toHaveProperty('id');
    });

    it('should throw if appointment not found', async () => {
      prisma.appointment.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user1', 'app1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  describe('update', () => {
    it('should update an appointment', async () => {
      prisma.appointment.findFirst.mockResolvedValue({ id: 'app1' });

      prisma.appointment.update.mockResolvedValue({
        id: 'app1',
        description: 'Atualizado',
      });

      const result = await service.update('user1', 'app1', {
        description: 'Atualizado',
      });

      expect(result.description).toBe('Atualizado');
    });

    it('should throw if appointment not found', async () => {
      prisma.appointment.findFirst.mockResolvedValue(null);

      await expect(
        service.update('user1', 'app1', { description: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  describe('remove', () => {
    it('should remove an appointment', async () => {
      prisma.appointment.findFirst.mockResolvedValue({ id: 'app1' });

      prisma.appointment.delete.mockResolvedValue({});

      const result = await service.remove('user1', 'app1');

      expect(prisma.appointment.delete).toHaveBeenCalledWith({
        where: { id: 'app1' },
      });

      expect(result).toEqual({
        message: 'Compromisso removido com sucesso.',
      });
    });

    it('should throw if appointment not found', async () => {
      prisma.appointment.findFirst.mockResolvedValue(null);

      await expect(service.remove('user1', 'app1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
