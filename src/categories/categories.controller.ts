import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskCategory } from '../tasks/category-suggestion.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  @Get()
  findAll() {
    return Object.values(TaskCategory);
  }
}
