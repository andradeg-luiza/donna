import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':phone')
  createTask(
    @Param('phone') phone: string,
    @Body() body: CreateTaskDto,
  ) {
    return this.tasksService.createTask(phone, body);
  }

  @Get(':phone')
  listTasks(@Param('phone') phone: string) {
    return this.tasksService.listTasks(phone);
  }

  @Post('done/:id')
  markDone(@Param('id') id: string) {
    return this.tasksService.markTaskDone(id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
