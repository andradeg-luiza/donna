import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskItemsService } from './task-items.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Task Items')
@ApiBearerAuth('bearer')
@Controller('task-items')
export class TaskItemsController {
  constructor(private readonly taskItemsService: TaskItemsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() data: CreateTaskItemDto) {
    return this.taskItemsService.create(user.id, data);
  }

  @Get(':taskId')
  findAll(@CurrentUser() user: any, @Param('taskId') taskId: string) {
    return this.taskItemsService.findAll(user.id, taskId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() data: UpdateTaskItemDto,
  ) {
    return this.taskItemsService.update(user.id, id, data);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.taskItemsService.remove(user.id, id);
  }
}
