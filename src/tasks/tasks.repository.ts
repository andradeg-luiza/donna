import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTask(userId: string, title: string, description?: string) {
    return this.prisma.task.create({
      data: { userId, title, description },
    });
  }

  listTasksByUser(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  markAsDone(id: string) {
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

  // 🔥 ESTE É O MÉTODO QUE ESTAVA FALTANDO
  deleteTasksByUserId(userId: string) {
    return this.prisma.task.deleteMany({
      where: { userId },
    });
  }
}
