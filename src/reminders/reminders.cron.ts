import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';

@Injectable()
export class RemindersCron {
  private readonly logger = new Logger(RemindersCron.name);

  constructor(private readonly remindersService: RemindersService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminders() {
    const pending = await this.remindersService.findPending();

    if (pending.length === 0) {
      return;
    }

    this.logger.log(`Encontrados ${pending.length} lembretes pendentes.`);

    for (const reminder of pending) {
      // Futuro: envio real via WhatsApp
      this.logger.log(
        `Enviando lembrete ${reminder.id} para usuário ${reminder.userId}: ${reminder.message}`,
      );

      await this.remindersService.markAsSent(reminder.id);
    }
  }
}
