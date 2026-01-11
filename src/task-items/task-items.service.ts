import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskItemsRepository } from './task-items.repository';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';

@Injectable()
export class TaskItemsService {
  constructor(
    private readonly taskItemsRepository: TaskItemsRepository,
    private readonly tasksService: TasksService,
  ) {}

  async create(userId: string, taskId: string, dto: CreateTaskItemDto) {
    const task = await this.tasksService.findOne(userId, taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.taskItemsRepository.create(taskId, dto.title);
  }

  async findAll(userId: string, taskId: string) {
    const task = await this.tasksService.findOne(userId, taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.taskItemsRepository.findAllByTask(taskId);
  }

  async update(
    userId: string,
    taskId: string,
    itemId: string,
    dto: UpdateTaskItemDto,
  ) {
    const task = await this.tasksService.findOne(userId, taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const item = await this.taskItemsRepository.findById(itemId);

    if (!item || item.taskId !== taskId) {
      throw new NotFoundException('Task item not found');
    }

    return this.taskItemsRepository.update(itemId, dto);
  }

  async delete(userId: string, taskId: string, itemId: string) {
    const task = await this.tasksService.findOne(userId, taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const item = await this.taskItemsRepository.findById(itemId);

    if (!item || item.taskId !== taskId) {
      throw new NotFoundException('Task item not found');
    }

    return this.taskItemsRepository.delete(itemId);
  }

  async toggle(userId: string, taskId: string, itemId: string) {
    const task = await this.tasksService.findOne(userId, taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const item = await this.taskItemsRepository.findById(itemId);

    if (!item || item.taskId !== taskId) {
      throw new NotFoundException('Task item not found');
    }

    return this.taskItemsRepository.update(itemId, { done: !item.done });
  }
}
