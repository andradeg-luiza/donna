import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { tasks: true },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  createUser(data: { name: string; phone: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
