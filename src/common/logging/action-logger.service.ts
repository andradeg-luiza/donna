import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActionLoggerService {
  private readonly logger = new Logger(ActionLoggerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(
    userId: string,
    action: string,
    payload: Record<string, any> | null = null,
  ): Promise<void> {
    try {
      await this.prisma.userAction.create({
        data: {
          userId,
          action,
          payload: payload ?? {},
        },
      });
    } catch (error) {
      // Evita que falhas no log quebrem a aplicação
      this.logger.error(
        `Failed to log action "${action}" for user ${userId}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
