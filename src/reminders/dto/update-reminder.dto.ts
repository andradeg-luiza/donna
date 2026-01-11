import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateReminderDto {
  @IsOptional()
  @IsDateString()
  remindAt?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
