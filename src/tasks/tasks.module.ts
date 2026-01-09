import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksRepository],
})
export class TasksModule {}
