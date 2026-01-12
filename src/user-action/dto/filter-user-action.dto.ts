import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
} from 'class-validator';
import {
  HistoryPeriod,
  HistoryStatus,
  HistoryCategory,
} from './user-action.enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterHistoryDto {
  @ApiPropertyOptional({
    description: 'Data inicial (ISO)',
    example: '2026-01-10T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Data final (ISO)',
    example: '2026-01-12T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Tipo exato da ação (ex: task.created)',
    example: 'task.created',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    enum: HistoryPeriod,
    description: 'Período amigável',
  })
  @IsOptional()
  @IsEnum(HistoryPeriod)
  period?: HistoryPeriod;

  @ApiPropertyOptional({
    enum: HistoryStatus,
    description: 'Status da ação',
  })
  @IsOptional()
  @IsEnum(HistoryStatus)
  status?: HistoryStatus;

  @ApiPropertyOptional({
    enum: HistoryCategory,
    isArray: true,
    description: 'Categorias (múltipla escolha)',
  })
  @IsOptional()
  @IsEnum(HistoryCategory, { each: true })
  category?: HistoryCategory | HistoryCategory[];
}
