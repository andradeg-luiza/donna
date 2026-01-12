import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Reminders')
@ApiBearerAuth('bearer')
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Req() req: Request, @Body() data: CreateReminderDto) {
    const userId = (req as any).user.sub;
    return this.remindersService.create(userId, data);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.remindersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.sub;
    return this.remindersService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() data: UpdateReminderDto,
  ) {
    const userId = (req as any).user.sub;
    return this.remindersService.update(userId, id, data);
  }

  @Delete(':id')
  delete(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user.sub;
    return this.remindersService.delete(userId, id);
  }
}
