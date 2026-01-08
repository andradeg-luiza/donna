import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createTaskForUser(userId: string, title: string, description?: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.tasksRepository.createTask(userId, title, description);
  }

  async listTasksByUser(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.tasksRepository.listTasksByUser(userId);
  }

  async markTaskAsDone(taskId: string) {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    return this.tasksRepository.markAsDone(taskId);
  }

  async deleteTask(id: string) {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.deleteTask(id);

    return { message: 'Task deleted successfully' };
  }
}
