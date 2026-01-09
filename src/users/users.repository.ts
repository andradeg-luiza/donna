import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
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

  deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
