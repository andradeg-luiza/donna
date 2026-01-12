import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ActionLoggerService } from '../common/logging/action-logger.service';
import { RemindersModule } from '../reminders/reminders.module';

@Module({
  imports: [RemindersModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    PrismaService,
    ActionLoggerService,
  ],
})
export class TasksModule {}
