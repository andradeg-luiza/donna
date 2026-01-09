import { Controller, Post, Body, Get, Param, Patch, Delete, Headers } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task for a user' })
  create(
    @Headers('x-user-phone') phone: string,
    @Body() body: CreateTaskDto,
  ) {
    return this.tasksService.create(phone, body);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks for a user' })
  findByUser(@Headers('x-user-phone') phone: string) {
    return this.tasksService.findByUser(phone);
  }

  @Patch(':id/done')
  @ApiOperation({ summary: 'Mark a task as done' })
  markDone(@Param('id') id: string) {
    return this.tasksService.markDone(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by id' })
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
