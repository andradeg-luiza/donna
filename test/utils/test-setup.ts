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

export const getApp = () => app;

export const resetDatabase = async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
};

export const setupTestApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();

  // 🔥 REGISTRA O VALIDATION PIPE AQUI
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🔥 REGISTRA O EXCEPTION FILTER AQUI
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(0);

  const url = await app.getUrl();
  request.setBaseUrl(url);

  return app;
};

export const closeTestApp = async () => {
  if (app) {
    await app.close();
  }
};
