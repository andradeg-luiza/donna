import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsDateString()
  remindAt!: string;

  @IsOptional()
  @IsString()
  message?: string;
}
