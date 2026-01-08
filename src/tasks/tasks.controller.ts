import { Body, Controller, Get, Param, Patch, Post, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.createTaskForUser(body.userId, body.title, body.description);
  }

  @Get('user/:userId')
  listTasksByUser(@Param('userId') userId: string) {
    return this.tasksService.listTasksByUser(userId);
  }

  @Patch(':id/done')
  markAsDone(@Param('id') id: string) {
    return this.tasksService.markTaskAsDone(id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
