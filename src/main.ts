import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ativa validação automática dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos extras
      forbidNonWhitelisted: true, // erro se enviar campos desconhecidos
      transform: true, // transforma payload em DTO automaticamente
    }),
  );

  // ativa o filtro global de erros
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
