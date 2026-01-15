import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateReminderDto) {
    if (!data.taskId && !data.appointmentId) {
      throw new ForbiddenException(
        'O lembrete deve estar associado a uma task ou appointment.',
      );
    }

    if (data.taskId) {
      const task = await this.prisma.task.findUnique({
        where: { id: data.taskId },
      });

      if (!task) {
        throw new NotFoundException('Task não encontrada.');
      }

      if (task.userId !== userId) {
        throw new ForbiddenException('Acesso negado.');
      }
    }

    if (data.appointmentId) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: data.appointmentId },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment não encontrado.');
      }

      if (appointment.userId !== userId) {
        throw new ForbiddenException('Acesso negado.');
      }
    }

    return this.prisma.reminder.create({
      data: {
        remindAt: data.remindAt,
        message: data.message,
        taskId: data.taskId,
        appointmentId: data.appointmentId,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.reminder.findMany({
      where: { userId },
      orderBy: { remindAt: 'asc' },
    });
  }

  async findOne(userId: string, reminderId: string) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado.');
    }

    if (reminder.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
    }

    return reminder;
  }

  async update(userId: string, reminderId: string, data: UpdateReminderDto) {
    await this.findOne(userId, reminderId);

    return this.prisma.reminder.update({
      where: { id: reminderId },
      data,
    });
  }

  async remove(userId: string, reminderId: string) {
    await this.findOne(userId, reminderId);

    await this.prisma.reminder.delete({
      where: { id: reminderId },
    });

    return { message: 'Lembrete removido com sucesso.' };
  }
}
