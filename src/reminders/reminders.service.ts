import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  async create(userId: string, data: CreateReminderDto) {
    // Valida se está associado a uma task ou appointment
    if (!data.taskId && !data.appointmentId) {
      throw new NotFoundException(
        'O lembrete deve estar associado a uma task ou appointment.',
      );
    }

    // Valida ownership da task
    if (data.taskId) {
      const task = await this.prisma.task.findFirst({
        where: { id: data.taskId, userId },
      });

      if (!task) {
        throw new NotFoundException('Task não encontrada.');
      }
    }

    // Valida ownership do appointment
    if (data.appointmentId) {
      const appointment = await this.prisma.appointment.findFirst({
        where: { id: data.appointmentId, userId },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment não encontrado.');
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

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  async findAll(userId: string) {
    return this.prisma.reminder.findMany({
      where: { userId },
      orderBy: { remindAt: 'asc' },
    });
  }

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  async findOne(userId: string, reminderId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id: reminderId, userId },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado.');
    }

    return reminder;
  }

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  async update(userId: string, reminderId: string, data: UpdateReminderDto) {
    await this.findOne(userId, reminderId);

    return this.prisma.reminder.update({
      where: { id: reminderId },
      data,
    });
  }

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  async remove(userId: string, reminderId: string) {
    await this.findOne(userId, reminderId);

    await this.prisma.reminder.delete({
      where: { id: reminderId },
    });

    return { message: 'Lembrete removido com sucesso.' };
  }
}
