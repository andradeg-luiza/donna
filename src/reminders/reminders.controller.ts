import { Controller, Post, Body, Param, Req, Get } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
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
}
