import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ActionLoggerService } from '../common/logging/action-logger.service';

@Injectable()
export class RemindersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actionLogger: ActionLoggerService,
  ) {}

  async create(userId: string, data: CreateReminderDto) {
    if (data.taskId) {
      const task = await this.prisma.task.findFirst({
        where: { id: data.taskId, userId },
      });

      if (!task) {
        throw new NotFoundException('Task não encontrada.');
      }
    }

    if (data.appointmentId) {
      const appointment = await this.prisma.appointment.findFirst({
        where: { id: data.appointmentId, userId },
      });

      if (!appointment) {
        throw new NotFoundException('Compromisso não encontrado.');
      }
    }

    const reminder = await this.prisma.reminder.create({
      data: {
        userId,
        taskId: data.taskId ?? null,
        appointmentId: data.appointmentId ?? null,
        remindAt: data.remindAt,
        message: data.message ?? null,
      },
    });

    await this.actionLogger.log(userId, 'reminder.created', {
      reminderId: reminder.id,
      taskId: data.taskId ?? null,
      appointmentId: data.appointmentId ?? null,
      remindAt: reminder.remindAt,
    });

    return reminder;
  }

  async findAll(userId: string) {
    return this.prisma.reminder.findMany({
      where: { userId },
      orderBy: { remindAt: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado.');
    }

    return reminder;
  }

  async update(userId: string, id: string, data: UpdateReminderDto) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado.');
    }

    return this.prisma.reminder.update({
      where: { id },
      data: {
        remindAt: data.remindAt ?? reminder.remindAt,
        message: data.message ?? reminder.message,
      },
    });
  }

  async delete(userId: string, id: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado.');
    }

    await this.prisma.reminder.delete({
      where: { id },
    });

    return { message: 'Lembrete removido com sucesso.' };
  }

  async cancelByTaskId(taskId: string) {
    await this.prisma.reminder.deleteMany({
      where: { taskId },
    });
  }
}
