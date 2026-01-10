import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TaskItemsService } from './task-items.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Task Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/items')
export class TaskItemsController {
  constructor(private readonly taskItemsService: TaskItemsService) {}

  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskItemDto,
  ) {
    return this.taskItemsService.create(userId, taskId, dto);
  }

  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.taskItemsService.findAll(userId, taskId);
  }

  @Patch(':itemId')
  update(
    @CurrentUser('sub') userId: string,
    @Param('taskId') taskId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateTaskItemDto,
  ) {
    return this.taskItemsService.update(userId, taskId, itemId, dto);
  }

  @Delete(':itemId')
  delete(
    @CurrentUser('sub') userId: string,
    @Param('taskId') taskId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.taskItemsService.delete(userId, taskId, itemId);
  }

  @Patch(':itemId/toggle')
  toggle(
    @CurrentUser('sub') userId: string,
    @Param('taskId') taskId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.taskItemsService.toggle(userId, taskId, itemId);
  }
}
