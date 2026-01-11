import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RemindersService } from '../reminders/reminders.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly remindersService: RemindersService,
  ) {}

  async create(userId: string, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description ?? null,
        category: data.category ?? null,
        priority: data.priority ?? null,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    return task;
  }

  async update(userId: string, id: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    const wasDone = task.done;
    const willBeDone = data.done;

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: data.title ?? task.title,
        description: data.description ?? task.description,
        category: data.category ?? task.category,
        priority: data.priority ?? task.priority,
        done: typeof data.done === 'boolean' ? data.done : task.done,
      },
    });

    if (wasDone === false && willBeDone === true) {
      await this.remindersService.cancelByTaskId(id);
    }

    return updated;
  }

  async delete(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: 'Task removida com sucesso.' };
  }
}
