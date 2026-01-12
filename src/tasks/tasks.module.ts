import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CategorySuggestionService } from './category-suggestion.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, CategorySuggestionService],
})
export class TasksModule {}
