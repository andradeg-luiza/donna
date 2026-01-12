import { Module } from '@nestjs/common';
import { TaskItemsService } from './task-items.service';
import { TaskItemsController } from './task-items.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ActionLoggerService } from '../common/logging/action-logger.service';

@Module({
  controllers: [TaskItemsController],
  providers: [
    TaskItemsService,
    PrismaService,
    ActionLoggerService,
  ],
})
export class TaskItemsModule {}
