import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  async create(userId: string, data: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        description: data.description,
        scheduledAt: data.scheduledAt,
        userId,
      },
    });
  }

  // -----------------------------------------------------
  // FIND ALL
  // -----------------------------------------------------
  async findAll(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  async findOne(userId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, userId },
    });

    if (!appointment) {
      throw new NotFoundException('Compromisso não encontrado.');
    }

    return appointment;
  }

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  async update(
    userId: string,
    appointmentId: string,
    data: UpdateAppointmentDto,
  ) {
    await this.findOne(userId, appointmentId);

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data,
    });
  }

  // -----------------------------------------------------
  // REMOVE
  // -----------------------------------------------------
  async remove(userId: string, appointmentId: string) {
    await this.findOne(userId, appointmentId);

    await this.prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return { message: 'Compromisso removido com sucesso.' };
  }
}
