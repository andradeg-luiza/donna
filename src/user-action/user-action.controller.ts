import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './user-action.service';
import { FilterHistoryDto } from './dto/filter-user-action.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  findAll(@Req() req: Request, @Query() filters: FilterHistoryDto) {
    const userId = (req as any).user.sub;
    return this.historyService.findAll(userId, filters);
  }
}
