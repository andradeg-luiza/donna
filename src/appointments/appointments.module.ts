import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ActionLoggerService } from '../common/logging/action-logger.service';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    PrismaService,
    ActionLoggerService,
  ],
})
export class AppointmentsModule {}
