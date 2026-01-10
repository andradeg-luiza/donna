import { Module } from '@nestjs/common';
import { TaskItemsController } from './task-items.controller';
import { TaskItemsService } from './task-items.service';
import { TaskItemsRepository } from './task-items.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [PrismaModule, TasksModule],
  controllers: [TaskItemsController],
  providers: [TaskItemsService, TaskItemsRepository],
  exports: [TaskItemsService],
})
export class TaskItemsModule {}
