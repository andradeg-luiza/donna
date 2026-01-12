import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterHistoryDto } from './dto/filter-user-action.dto';
import {
  HistoryPeriod,
  HistoryStatus,
} from './dto/user-action.enums';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, filters: FilterHistoryDto) {
    const where: any = { userId };

    if (filters.category) {
      const categories = Array.isArray(filters.category)
        ? filters.category
        : [filters.category];

      where.OR = categories.map((c) => ({
        action: { startsWith: `${c}.` },
      }));
    }

    if (filters.type) {
      where.action = filters.type;
    }

    if (filters.status === HistoryStatus.COMPLETED) {
      where.action = { contains: '.completed' };
    }

    if (filters.status === HistoryStatus.PENDING) {
      where.action = { contains: '.pending' };
    }

    if (filters.period) {
      const now = new Date();
      let from: Date | undefined;
      let to: Date | undefined;

      switch (filters.period) {
        case HistoryPeriod.TODAY:
          from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          to = new Date();
          break;

        case HistoryPeriod.YESTERDAY:
          from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;

        case HistoryPeriod.LAST7:
          from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          to = new Date();
          break;

        case HistoryPeriod.THIS_MONTH:
          from = new Date(now.getFullYear(), now.getMonth(), 1);
          to = new Date();
          break;

        case HistoryPeriod.LAST_MONTH:
          from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          to = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    return this.prisma.userAction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
