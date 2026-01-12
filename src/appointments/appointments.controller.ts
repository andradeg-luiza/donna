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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Appointments')
@ApiBearerAuth('bearer')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() data: CreateAppointmentDto) {
    return this.appointmentsService.create(user.id, data);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.appointmentsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.appointmentsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(user.id, id, data);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.appointmentsService.remove(user.id, id);
  }
}
