import { Controller, Get, Post, Query, Body } from '@nestjs/common';

@Controller('webhook/whatsapp')
export class WhatsappController {
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    console.log('TOKEN NO ENV:', process.env.WHATSAPP_VERIFY_TOKEN);
    console.log('TOKEN RECEBIDO:', token);

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return challenge;
    }

    return 'Invalid token';
  }

  @Post()
  handleMessage(@Body() body: any) {
    console.log(
      'Mensagem recebida do WhatsApp:',
      JSON.stringify(body, null, 2),
    );

    return { status: 'received' };
  }
}
