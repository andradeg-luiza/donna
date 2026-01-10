import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private repo: TasksRepository) {}

  create(userId: string, data: CreateTaskDto) {
    return this.repo.create(userId, data);
  }

  findAll(userId: string) {
    return this.repo.findAll(userId);
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
    return this.repo.findById(taskId); // 👈 CORREÇÃO AQUI
  }
}
