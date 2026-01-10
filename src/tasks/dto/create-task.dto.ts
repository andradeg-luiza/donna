import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

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
    description: 'Categoria da task. Se não enviada, o sistema poderá sugerir automaticamente.',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
