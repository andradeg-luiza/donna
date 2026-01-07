import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    userId: string,
    title: string,
    description?: string,
  ): Promise<Task> {
    return this.prisma.task.create({
      data: {
        userId,
        title,
        description,
      },
    });
  }

  async listTasksByUser(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  async markAsDone(taskId: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { done: true },
    });
  }

  async findById(taskId: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id: taskId },
    });
  }
}
