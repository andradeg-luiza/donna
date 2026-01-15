import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        description: data.description,
        scheduledAt: data.scheduledAt,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(userId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Compromisso não encontrado.');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException('Acesso negado.');
    }

    return appointment;
  }

  async update(userId: string, appointmentId: string, data: UpdateAppointmentDto) {
    await this.findOne(userId, appointmentId);

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data,
    });
  }

  async remove(userId: string, appointmentId: string) {
    await this.findOne(userId, appointmentId);

    await this.prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return { message: 'Compromisso removido com sucesso.' };
  }
}
