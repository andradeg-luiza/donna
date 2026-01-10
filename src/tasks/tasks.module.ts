import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService], // 👈 ESSA LINHA É O QUE FALTAVA
})
export class TasksModule {}
