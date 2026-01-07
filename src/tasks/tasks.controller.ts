import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() body: CreateTaskDto) {
    const { userId, title, description } = body;
    return this.tasksService.createTaskForUser(userId, title, description);
  }

  @Get('user/:userId')
  async listTasksByUser(@Param('userId') userId: string) {
    return this.tasksService.listTasksByUser(userId);
  }

  @Patch(':id/done')
  async markAsDone(@Param('id') id: string) {
    return this.tasksService.markTaskAsDone(id);
  }
}
