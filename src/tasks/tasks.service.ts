import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CategorySuggestionService } from './category-suggestion.service';

@Injectable()
export class TasksService {
  constructor(
    private repo: TasksRepository,
    private categorySuggestionService: CategorySuggestionService,
  ) {}

  async create(userId: string, data: CreateTaskDto) {
    let category = data.category;

    if (!category) {
      const baseText = `${data.title} ${data.description ?? ''}`.trim();
      category = this.categorySuggestionService.suggestCategory(baseText);
    }

    return this.repo.create(userId, {
      ...data,
      category,
    });
  }

  findAll(userId: string, category?: string) {
    return this.repo.findAll(userId, category);
  }

  async findOne(userId: string, id: string) {
    const task = await this.repo.findOne(userId, id);
    if (!task) throw new NotFoundException('Tarefa não encontrada.');
    return task;
  }

  async update(userId: string, id: string, data: UpdateTaskDto) {
    const result = await this.repo.update(userId, id, data);
    if (result.count === 0) throw new NotFoundException('Tarefa não encontrada.');
    return { message: 'Tarefa atualizada.' };
  }

  async delete(userId: string, id: string) {
    const result = await this.repo.delete(userId, id);
    if (result.count === 0) throw new NotFoundException('Tarefa não encontrada.');
    return { message: 'Tarefa removida.' };
  }

  async findById(taskId: string) {
    return this.repo.findById(taskId);
  }
}
