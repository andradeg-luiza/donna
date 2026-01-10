import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: Omit<Prisma.TaskCreateInput, 'user'>) {
    return this.prisma.task.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
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
      include: { items: true },
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

  findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }
}
