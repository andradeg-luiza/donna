import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategorySuggestionService } from './category-suggestion.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskCategory } from '@prisma/client';

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
    const categoryString =
      data.category ||
      (await this.categorySuggestion.suggestCategory(data.title));

    const category = categoryString as TaskCategory;

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
  // FIND ONE (com 404 e 403 corretos)
  // -----------------------------------------------------
  async findOne(userId: string, taskId: string) {
    // 1. Busca pelo ID (sem filtrar userId)
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    // 2. Se não existe → 404
    if (!task) {
      throw new NotFoundException('Task não encontrada.');
    }

    // 3. Se existe mas pertence a outro usuário → 403
    if (task.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
    }

    return task;
  }

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  async update(userId: string, taskId: string, data: UpdateTaskDto) {
    const task = await this.findOne(userId, taskId);

    const categoryString =
      data.category ||
      (data.title
        ? await this.categorySuggestion.suggestCategory(data.title)
        : task.category);

    const category = categoryString as TaskCategory;

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
