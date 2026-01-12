import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';

@Injectable()
export class TaskItemsService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  async create(userId: string, data: CreateTaskItemDto) {
    // Valida ownership da task
    const task = await this.prisma.task.findFirst({
      where: { id: data.taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    return this.prisma.taskItem.create({
      data: {
        title: data.title,
        taskId: data.taskId,
      },
    });
  }

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  async findAll(userId: string, taskId: string) {
    // Valida ownership da task
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    return this.prisma.taskItem.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // -----------------------------------------------------
  // FIND ONE (interno)
  // -----------------------------------------------------
  private async findOneInternal(userId: string, itemId: string) {
    const item = await this.prisma.taskItem.findFirst({
      where: {
        id: itemId,
        task: { userId },
      },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado.');
    }

    return item;
  }

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  async update(userId: string, itemId: string, data: UpdateTaskItemDto) {
    await this.findOneInternal(userId, itemId);

    return this.prisma.taskItem.update({
      where: { id: itemId },
      data,
    });
  }

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  async remove(userId: string, itemId: string) {
    await this.findOneInternal(userId, itemId);

    await this.prisma.taskItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removido com sucesso.' };
  }
}
