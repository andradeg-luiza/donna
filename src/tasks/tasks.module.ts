import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CategorySuggestionService } from './category-suggestion.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, CategorySuggestionService],
  exports: [TasksService],
})
export class TasksModule {}
