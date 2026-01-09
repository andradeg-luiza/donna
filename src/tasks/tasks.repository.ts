import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTask(data: { userId: string; title: string; description?: string }) {
    return this.prisma.task.create({
      data,
    });
  }

  findByUserId(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  markTaskDone(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: { done: true },
    });
  }

  deleteTask(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
