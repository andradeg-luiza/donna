import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTask(userId: string, title: string, description?: string) {
    return this.prisma.task.create({ data: { userId, title, description } });
  }

  listTasksByUser(userId: string) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  markAsDone(taskId: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { done: true },
    });
  }

  findById(taskId: string) {
    return this.prisma.task.findUnique({ where: { id: taskId } });
  }

  async deleteTask(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
