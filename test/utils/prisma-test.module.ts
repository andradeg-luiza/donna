import { Module } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../prisma/prisma-mock';

@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: prismaMock,
    },
  ],
  exports: [PrismaService],
})
export class PrismaTestModule {}
