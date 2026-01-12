import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersCron {
  private readonly logger = new Logger(RemindersCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminders() {
    const now = new Date();

    const pending = await this.prisma.reminder.findMany({
      where: {
        sent: false,
        remindAt: { lte: now },
      },
    });

    if (pending.length === 0) {
      return;
    }

    this.logger.log(`Encontrados ${pending.length} lembretes pendentes.`);

    for (const reminder of pending) {
      this.logger.log(
        `Enviando lembrete ${reminder.id} para usuário ${reminder.userId}: ${reminder.message}`,
      );

      await this.prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          sent: true,
          sentAt: new Date(),
        },
      });
    }
  }
}
