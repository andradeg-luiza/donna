import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ActionLoggerService } from '../common/logging/action-logger.service';

@Module({
  controllers: [RemindersController],
  providers: [
    RemindersService,
    PrismaService,
    ActionLoggerService,
  ],
  exports: [RemindersService],
})
export class RemindersModule {}
