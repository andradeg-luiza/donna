import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') {
      this.logger.log('PrismaClient initialized (no connect) for test environment');
      return;
    }

    await this.client.$connect();
    this.logger.log('Prisma connected successfully');
  }

  async onModuleDestroy() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    await this.client.$disconnect();
    this.logger.log('Prisma disconnected');
  }

  get user() {
    return this.client.user;
  }

  get task() {
    return this.client.task;
  }

  get appointment() {
    return this.client.appointment;
  }

  get reminder() {
    return this.client.reminder;
  }

  get taskItem() {
    return this.client.taskItem;
  }

  get userAction() {
    return this.client.userAction;
  }
}
