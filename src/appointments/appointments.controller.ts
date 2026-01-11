import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() data: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(userId, data);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.appointmentsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(userId, id, data);
  }

  @Delete(':id')
  delete(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.delete(userId, id);
  }
}
