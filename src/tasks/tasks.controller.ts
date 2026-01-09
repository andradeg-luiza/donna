import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PhonePipe } from '../common/pipes/phone.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':phone')
  create(
    @Param('phone', PhonePipe) phone: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(phone, dto);
  }

  @Get(':phone')
  list(@Param('phone', PhonePipe) phone: string) {
    return this.tasksService.listTasks(phone);
  }

  @Post('done/:id')
  @HttpCode(200)
  markDone(@Param('id') id: string) {
    return this.tasksService.markTaskDone(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
