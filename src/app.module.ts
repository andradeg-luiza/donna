import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsappModule } from './presentation/whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // permite usar process.env em qualquer lugar
      envFilePath: '.env', // garante que o Nest leia o arquivo .env
    }),
    WhatsappModule,
  ],
})
export class AppModule {}
