import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, taskId: string, data: CreateReminderDto) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    return this.prisma.reminder.create({
      data: {
        userId,
        taskId,
        remindAt: new Date(data.remindAt),
        message: data.message ?? null,
      },
    });
  }

  async findAllByTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    return this.prisma.reminder.findMany({
      where: { taskId },
      orderBy: { remindAt: 'asc' },
    });
  }

  async findOne(userId: string, taskId: string, id: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, taskId, userId },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado.');
    }

    return reminder;
  }

  async update(userId: string, taskId: string, id: string, data: UpdateReminderDto) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, taskId, userId },
    });

    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado.');
    }

    return this.prisma.reminder.update({
      where: { id },
      data: {
        remindAt: data.remindAt ? new Date(data.remindAt) : reminder.remindAt,
        message: data.message ?? reminder.message,
      },
    });
  }
}
