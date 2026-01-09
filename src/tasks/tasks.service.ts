import { Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(phone: string, data: CreateTaskDto) {
    const user = await this.usersService.findByPhone(phone);

    return this.tasksRepository.createTask({
      userId: user.id,
      title: data.title,
      description: data.description,
    });
  }

  async findByUser(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    return this.tasksRepository.findByUserId(user.id);
  }

  async markDone(id: string) {
    return this.tasksRepository.markTaskDone(id);
  }

  async delete(id: string) {
    return this.tasksRepository.deleteTask(id);
  }
}
