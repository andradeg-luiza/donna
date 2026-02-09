import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskItemsModule } from './task-items/task-items.module';
import { RemindersModule } from './reminders/reminders.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { HistoryModule } from './user-action/user-action.module';
import { CategoriesModule } from './categories/categories.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? '.env.test'
          : '.env',
    }),

    ScheduleModule.forRoot(),

    PrismaModule,
    AuthModule,
    TasksModule,
    TaskItemsModule,
    RemindersModule,
    AppointmentsModule,
    HistoryModule,
    CategoriesModule,

    WhatsappModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
