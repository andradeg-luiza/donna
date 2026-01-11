import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTaskItemDto {
  @ApiProperty({
    example: 'Comprar pão',
    description: 'Título do item da task',
  })
  @IsString()
  @MinLength(1)
  title!: string;
}
