import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActionLoggerService {
  constructor(private readonly prisma: PrismaService) {}

  async log(userId: string, action: string, payload: any) {
    await this.prisma.userAction.create({
      data: {
        userId,
        action,
        payload,
      },
    });
  }
}
