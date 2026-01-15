import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from '../../src/common/filter/http-exception.filter';

export function setupE2EApp(app: INestApplication) {
  // Pipes globais — iguais ao main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Interceptores globais — iguais ao main.ts
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // Filtros globais — iguais ao main.ts
  app.useGlobalFilters(new HttpExceptionFilter());

  return app;
}
