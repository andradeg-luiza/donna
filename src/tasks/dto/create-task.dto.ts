import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Comprar pão' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Pão integral na padaria' })
  @IsOptional()
  @IsString()
  description?: string;
}
