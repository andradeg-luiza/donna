import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Comprar pão' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Pão integral na padaria', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Compras',
    required: false,
    description:
      'Categoria da task. Se não enviada, o sistema poderá sugerir automaticamente.',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'HIGH',
    required: false,
    enum: TaskPriority,
    description: 'Prioridade da tarefa.',
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
