import { Controller, Post, Get, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService) {}

  @Post()
  create(@Req() req: Request, @Body() data: CreateTaskDto) {
    return this.service.create(req.user.sub, data);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.service.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.service.findOne(req.user.sub, id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() data: UpdateTaskDto) {
    return this.service.update(req.user.sub, id, data);
  }

  @Delete(':id')
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.service.delete(req.user.sub, id);
  }
}
