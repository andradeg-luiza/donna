import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RemindersCron } from './reminders.cron';

@Module({
  imports: [PrismaModule],
  controllers: [RemindersController],
  providers: [RemindersService, RemindersCron],
})
export class RemindersModule {}
