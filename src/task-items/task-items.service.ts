import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';
import { ActionLoggerService } from '../common/logging/action-logger.service';

@Injectable()
export class TaskItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actionLogger: ActionLoggerService,
  ) {}

  async create(userId: string, taskId: string, data: CreateTaskItemDto) {
    // Verifica se a task pertence ao usuário
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    const item = await this.prisma.taskItem.create({
      data: {
        taskId,
        title: data.title,
      },
    });

    // 🔵 Registrar ação no histórico
    await this.actionLogger.log(userId, 'task.item.created', {
      itemId: item.id,
      taskId,
      title: item.title,
    });

    return item;
  }

  async update(userId: string, id: string, data: UpdateTaskItemDto) {
    const item = await this.prisma.taskItem.findFirst({
      where: { id },
      include: { task: true },
    });

    if (!item || item.task.userId !== userId) {
      throw new NotFoundException('Item não encontrado.');
    }

    return this.prisma.taskItem.update({
      where: { id },
      data: {
        title: data.title ?? item.title,
        done: typeof data.done === 'boolean' ? data.done : item.done,
      },
    });
  }

  async delete(userId: string, id: string) {
    const item = await this.prisma.taskItem.findFirst({
      where: { id },
      include: { task: true },
    });

    if (!item || item.task.userId !== userId) {
      throw new NotFoundException('Item não encontrado.');
    }

    await this.prisma.taskItem.delete({
      where: { id },
    });

    return { message: 'Item removido com sucesso.' };
  }
}
