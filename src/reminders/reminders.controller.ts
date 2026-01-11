import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  Patch,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Reminders')
@ApiBearerAuth('bearer')
@Controller('tasks/:taskId/reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(
    @Req() req: Request,
    @Param('taskId') taskId: string,
    @Body() data: CreateReminderDto,
  ) {
    return this.remindersService.create(req.user.id, taskId, data);
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Param('taskId') taskId: string,
  ) {
    return this.remindersService.findAllByTask(req.user.id, taskId);
  }

  @Get(':id')
  findOne(
    @Req() req: Request,
    @Param('taskId') taskId: string,
    @Param('id') id: string,
  ) {
    return this.remindersService.findOne(req.user.id, taskId, id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @Body() data: UpdateReminderDto,
  ) {
    return this.remindersService.update(req.user.id, taskId, id, data);
  }
}
