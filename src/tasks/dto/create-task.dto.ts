import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Lista de compras' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Itens do mês', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
