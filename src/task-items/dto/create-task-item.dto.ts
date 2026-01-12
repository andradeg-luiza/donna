import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateTaskItemDto {
  @ApiProperty({
    example: 'Comprar pão',
    description: 'Título do item da task',
  })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({
    example: 'task_123',
    description: 'ID da task à qual este item pertence',
  })
  @IsString()
  @IsNotEmpty()
  taskId!: string;
}
