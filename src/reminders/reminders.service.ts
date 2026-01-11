import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

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
}
