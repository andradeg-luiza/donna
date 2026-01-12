import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ActionLoggerService } from '../common/logging/action-logger.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actionLogger: ActionLoggerService,
  ) {}

  async create(userId: string, data: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        userId,
        description: data.description,
        scheduledAt: data.scheduledAt,
      },
    });

    // 🔵 Registrar ação no histórico
    await this.actionLogger.log(userId, 'appointment.created', {
      appointmentId: appointment.id,
      description: appointment.description,
      scheduledAt: appointment.scheduledAt,
    });

    return appointment;
  }

  async findAll(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
    });

    if (!appointment) {
      throw new NotFoundException('Compromisso não encontrado.');
    }

    return appointment;
  }

  async update(userId: string, id: string, data: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
    });

    if (!appointment) {
      throw new NotFoundException('Compromisso não encontrado.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        description: data.description ?? appointment.description,
        scheduledAt: data.scheduledAt ?? appointment.scheduledAt,
      },
    });
  }

  async delete(userId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, userId },
    });

    if (!appointment) {
      throw new NotFoundException('Compromisso não encontrado.');
    }

    await this.prisma.appointment.delete({
      where: { id },
    });

    return { message: 'Compromisso removido com sucesso.' };
  }
}
