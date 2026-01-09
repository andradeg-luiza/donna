import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Cria uma task para um usuário identificado por telefone.
   */
  async createTask(phone: string, dto: CreateTaskDto) {
    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    const user = await this.usersService.getUserByIdOrPhone(phone);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId: user.id,
      },
    });
  }

  /**
   * Lista tasks de um usuário.
   */
  async listTasks(phone: string) {
    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    const user = await this.usersService.getUserByIdOrPhone(phone);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.task.findMany({
      where: { userId: user.id },
    });
  }

  /**
   * Marca uma task como concluída.
   */
  async markTaskDone(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data: { done: true },
    });
  }

  /**
   * Remove uma task.
   */
  async deleteTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({
      where: { id },
    });

    return { success: true };
  }
}
