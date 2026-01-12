import { Module } from '@nestjs/common';
import { HistoryService } from './user-action.service';
import { HistoryController } from './user-action.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService],
})
export class HistoryModule {}
