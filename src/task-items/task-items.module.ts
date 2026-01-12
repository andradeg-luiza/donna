import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskItemsController } from './task-items.controller';
import { TaskItemsService } from './task-items.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaskItemsController],
  providers: [TaskItemsService],
})
export class TaskItemsModule {}
