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
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Reminders')
@ApiBearerAuth('bearer')
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() data: CreateReminderDto) {
    return this.remindersService.create(user.id, data);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.remindersService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.remindersService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() data: UpdateReminderDto,
  ) {
    return this.remindersService.update(user.id, id, data);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.remindersService.remove(user.id, id);
  }
}
