import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task for a user' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.createTaskForUser(
      body.userId,
      body.title,
      body.description,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List all tasks for a user' })
  @ApiResponse({ status: 200, description: 'Tasks listed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  listTasksByUser(@Param('userId') userId: string) {
    return this.tasksService.listTasksByUser(userId);
  }

  @Patch(':id/done')
  @ApiOperation({ summary: 'Mark a task as done' })
  @ApiResponse({ status: 200, description: 'Task marked as done' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  markAsDone(@Param('id') id: string) {
    return this.tasksService.markTaskAsDone(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by id' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
