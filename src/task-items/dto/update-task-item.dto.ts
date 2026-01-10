import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export class UpdateTaskItemDto {
  @ApiPropertyOptional({ example: 'Comprar pão integral' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
