import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Task } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(phone: string, name?: string): Promise<User> {
    return this.prisma.user.create({
      data: { phone, name },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async listUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { tasks: true },
    });
  }

  async createTaskForUser(
    userId: string,
    title: string,
    description?: string,
  ): Promise<Task> {
    return this.prisma.task.create({
      data: {
        userId,
        title,
        description,
      },
    });
  }
}
