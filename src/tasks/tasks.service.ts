import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategorySuggestionService } from './category-suggestion.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categorySuggestion: CategorySuggestionService,
  ) {}

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  async create(userId: string, data: CreateTaskDto) {
    const category =
      data.category ||
      (await this.categorySuggestion.suggestCategory(data.title));

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        category,
        userId,
      },
    });
  }

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  async findOne(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    return task;
  }

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  async update(userId: string, taskId: string, data: UpdateTaskDto) {
    const task = await this.findOne(userId, taskId);

    const category =
      data.category ||
      (data.title
        ? await this.categorySuggestion.suggestCategory(data.title)
        : task.category);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        category,
      },
    });
  }

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  async remove(userId: string, taskId: string) {
    await this.findOne(userId, taskId);

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task removida com sucesso.' };
  }
}
