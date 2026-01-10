import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...data, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(userId: string, id: string) {
    return this.prisma.task.findFirst({
      where: { id, userId },
    });
  }

  update(userId: string, id: string, data: UpdateTaskDto) {
    return this.prisma.task.updateMany({
      where: { id, userId },
      data,
    });
  }

  delete(userId: string, id: string) {
    return this.prisma.task.deleteMany({
      where: { id, userId },
    });
  }
  
  findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }
  
}
