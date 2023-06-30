import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../service';
import { Category } from '../entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from '../../auth/guard';

@ApiTags('categories')
@UseGuards(JwtGuard, ThrottlerGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':budgetId')
  @ApiOkResponse({ type: Category, isArray: true })
  getCategories(@Param('budgetId') budgetId: number) {
    return this.categoryService.getAll(budgetId);
  }

  @Post()
  @ApiOkResponse({ type: Category })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createOne(dto);
  }

  @Put(':categoryId')
  @ApiOkResponse({ type: Category })
  updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoryService.updateOne(categoryId, body);
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategory(@Param('categoryId') categoryId: number) {
    this.categoryService.deleteOne(categoryId);
  }
}
