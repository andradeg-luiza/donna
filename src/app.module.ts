import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TaskItemsModule } from './task-items/task-items.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TasksModule,
    TaskItemsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
