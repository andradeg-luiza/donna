import { Test, TestingModule } from '@nestjs/testing';
import { RemindersService } from '../../src/reminders/reminders.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../prisma/prisma-mock';
import { NotFoundException } from '@nestjs/common';

describe('RemindersService', () => {
  let service: RemindersService;
  let prisma: typeof prismaMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemindersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RemindersService>(RemindersService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  describe('create', () => {
    it('should throw if no taskId or appointmentId is provided', async () => {
      await expect(
        service.create('user1', {
          remindAt: new Date().toISOString(),
          message: 'Teste',
        } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create a reminder linked to a task', async () => {
      prisma.task.findFirst.mockResolvedValue({ id: 'task1', userId: 'user1' });

      prisma.reminder.create.mockResolvedValue({
        id: 'rem1',
        message: 'Lembrete',
        taskId: 'task1',
      });

      const result = await service.create('user1', {
        remindAt: new Date().toISOString(),
        message: 'Lembrete',
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
          remindAt: new Date().toISOString(),
          message: 'Lembrete',
          taskId: 'task1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create a reminder linked to an appointment', async () => {
      prisma.appointment.findFirst.mockResolvedValue({
        id: 'app1',
        userId: 'user1',
      });

      prisma.reminder.create.mockResolvedValue({
        id: 'rem1',
        message: 'Lembrete',
        appointmentId: 'app1',
      });

      const result = await service.create('user1', {
        remindAt: new Date().toISOString(),
        message: 'Lembrete',
        appointmentId: 'app1',
      });

      expect(prisma.appointment.findFirst).toHaveBeenCalledWith({
        where: { id: 'app1', userId: 'user1' },
      });

      expect(result).toHaveProperty('id');
    });

    it('should throw if appointment does not belong to user', async () => {
      prisma.appointment.findFirst.mockResolvedValue(null);

      await expect(
        service.create('user1', {
          remindAt: new Date().toISOString(),
          message: 'Lembrete',
          appointmentId: 'app1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  describe('findAll', () => {
    it('should return all reminders for a user', async () => {
      prisma.reminder.findMany.mockResolvedValue([
        { id: '1', message: 'A' },
        { id: '2', message: 'B' },
      ]);

      const result = await service.findAll('user1');

      expect(prisma.reminder.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { remindAt: 'asc' },
      });

      expect(result.length).toBe(2);
    });
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  describe('findOne', () => {
    it('should return a reminder', async () => {
      prisma.reminder.findFirst.mockResolvedValue({
        id: 'rem1',
        message: 'Teste',
      });

      const result = await service.findOne('user1', 'rem1');

      expect(result).toHaveProperty('id');
    });

    it('should throw if reminder not found', async () => {
      prisma.reminder.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user1', 'rem1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  describe('update', () => {
    it('should update a reminder', async () => {
      prisma.reminder.findFirst.mockResolvedValue({ id: 'rem1' });

      prisma.reminder.update.mockResolvedValue({
        id: 'rem1',
        message: 'Atualizado',
      });

      const result = await service.update('user1', 'rem1', {
        message: 'Atualizado',
      });

      expect(result.message).toBe('Atualizado');
    });

    it('should throw if reminder not found', async () => {
      prisma.reminder.findFirst.mockResolvedValue(null);

      await expect(
        service.update('user1', 'rem1', { message: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  describe('remove', () => {
    it('should remove a reminder', async () => {
      prisma.reminder.findFirst.mockResolvedValue({ id: 'rem1' });

      prisma.reminder.delete.mockResolvedValue({});

      const result = await service.remove('user1', 'rem1');

      expect(prisma.reminder.delete).toHaveBeenCalledWith({
        where: { id: 'rem1' },
      });

      expect(result).toEqual({ message: 'Lembrete removido com sucesso.' });
    });

    it('should throw if reminder not found', async () => {
      prisma.reminder.findFirst.mockResolvedValue(null);

      await expect(service.remove('user1', 'rem1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
