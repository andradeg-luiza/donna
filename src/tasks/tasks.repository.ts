import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: Prisma.TaskUncheckedCreateInput) {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  findAll(userId: string, category?: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(userId: string, id: string) {
    return this.prisma.task.findFirst({
      where: { id, userId },
    });
  }

  update(userId: string, id: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.updateMany({
      where: { id, userId },
      data,
    });
  }

  delete(userId: string, id: string) {
    return this.prisma.task.deleteMany({
      where: { id, userId },
    });
  }
}
