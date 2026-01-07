import { Injectable } from '@nestjs/common';
import { MessagingService } from '../../domain/interfaces/messaging-service.interface';

@Injectable()
export class WhatsappMessagingService implements MessagingService {
  async sendMessage(to: string, message: string): Promise<void> {
    await Promise.resolve(); // evita warning do linter

    console.log(`Mensagem enviada (stub) para ${to}: ${message}`);
  }
}
