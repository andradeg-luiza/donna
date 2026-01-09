// test/utils/test-setup.ts
import './test-env';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request } from 'pactum';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/filter/http-exception.filter';

let app: INestApplication;
const prisma = new PrismaClient();

/**
 * Retorna a instância atual da aplicação Nest.
 */
export const getApp = () => app;

/**
 * Limpa completamente o banco de dados antes de cada suite.
 */
export const resetDatabase = async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
};

/**
 * Inicializa a aplicação Nest para testes E2E.
 */
export const setupTestApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();

  // Pipes globais (validação)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();
  await app.listen(0);

  const url = await app.getUrl();
  request.setBaseUrl(url);

  return app;
};

/**
 * Fecha a aplicação após os testes.
 */
export const closeTestApp = async () => {
  if (app) {
    await app.close();
  }
};
