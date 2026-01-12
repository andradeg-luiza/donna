import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReminderDto {
  @IsDateString()
  remindAt!: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;
}
