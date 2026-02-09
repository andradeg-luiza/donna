import { Controller, Get, Query, ForbiddenException, Post, Body } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('whatsapp/webhook')
export class WhatsappController {
  @Public()
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
      return challenge; // Nest responde automaticamente
    }

    throw new ForbiddenException();
  }

  @Public()
  @Post()
  handleWebhook(@Body() body: any) {
    console.log('Webhook recebido:', JSON.stringify(body, null, 2));
    return { status: 'ok' };
  }
}
