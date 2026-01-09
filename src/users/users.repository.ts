import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
