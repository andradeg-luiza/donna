import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Comprar pão integral' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: 'Pão integral na padaria' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'HIGH',
    enum: TaskPriority,
    description: 'Prioridade da tarefa.',
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: 'Compras',
    description: 'Categoria da task.',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
