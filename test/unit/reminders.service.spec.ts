import { Test, TestingModule } from '@nestjs/testing';
import { RemindersService } from '../../src/reminders/reminders.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../prisma/prisma-mock';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

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

  describe('create', () => {
    it('should throw Forbidden if no taskId or appointmentId', async () => {
      await expect(
        service.create('user1', { remindAt: new Date().toISOString(), message: 'X' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create reminder linked to task', async () => {
      prisma.task.findUnique.mockResolvedValue({ id: 'task1', userId: 'user1' });

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

      expect(result.id).toBe('rem1');
    });

    it('should throw if task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(
        service.create('user1', { remindAt: 'x', message: 'x', taskId: 'task1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if task belongs to another user', async () => {
      prisma.task.findUnique.mockResolvedValue({ id: 'task1', userId: 'other' });

      await expect(
        service.create('user1', { remindAt: 'x', message: 'x', taskId: 'task1' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return reminder', async () => {
      prisma.reminder.findUnique.mockResolvedValue({
        id: 'rem1',
        userId: 'user1',
      });

      const result = await service.findOne('user1', 'rem1');

      expect(result.id).toBe('rem1');
    });

    it('should throw 404 if not found', async () => {
      prisma.reminder.findUnique.mockResolvedValue(null);

      await expect(service.findOne('user1', 'rem1')).rejects.toThrow(NotFoundException);
    });

    it('should throw 403 if belongs to another user', async () => {
      prisma.reminder.findUnique.mockResolvedValue({
        id: 'rem1',
        userId: 'other',
      });

      await expect(service.findOne('user1', 'rem1')).rejects.toThrow(ForbiddenException);
    });
  });
});
