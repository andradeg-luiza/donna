import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskItemsRepository {
  constructor(private prisma: PrismaService) {}

  create(taskId: string, title: string) {
    return this.prisma.taskItem.create({
      data: {
        title,
        taskId,
      },
    });
  }

  findAllByTask(taskId: string) {
    return this.prisma.taskItem.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(itemId: string) {
    return this.prisma.taskItem.findUnique({
      where: { id: itemId },
    });
  }

  update(itemId: string, data: { title?: string; done?: boolean }) {
    return this.prisma.taskItem.update({
      where: { id: itemId },
      data,
    });
  }

  delete(itemId: string) {
    return this.prisma.taskItem.delete({
      where: { id: itemId },
    });
  }
}
