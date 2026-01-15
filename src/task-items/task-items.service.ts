import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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
    // 1. Busca a task pelo ID
    const task = await this.prisma.task.findUnique({
      where: { id: data.taskId },
    });

    // 2. Se não existe → 404
    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    // 3. Se existe mas pertence a outro usuário → 403
    if (task.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
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
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
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
    const item = await this.prisma.taskItem.findUnique({
      where: { id: itemId },
      include: { task: true },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado.');
    }

    if (item.task.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
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
