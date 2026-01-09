import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'd8849762-8270-4876-a3e9-fff4f9d33197',
    description: 'User ID that owns the task',
  })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'Comprar ração', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Lembrar de comprar ração para Donna',
    description: 'Task description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
