import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Tasks')
@ApiBearerAuth('bearer')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: Request, @Body() data: CreateTaskDto) {
    return this.tasksService.create(req.user.id, data);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() data: UpdateTaskDto) {
    return this.tasksService.update(req.user.id, id, data);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.delete(req.user.id, id);
  }
}
