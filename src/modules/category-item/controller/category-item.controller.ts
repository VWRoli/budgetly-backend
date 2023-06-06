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
import { JwtGuard } from 'src/modules/auth/guard';
import { CategoryItemService } from '../service';
import { CategoryItem } from '../entities';
import { CreateCategoryItemDto, UpdateCategoryItemDto } from '../dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('category-items')
@UseGuards(JwtGuard, ThrottlerGuard)
@Controller('category-item')
export class CategoryItemController {
  constructor(private readonly categoryItemService: CategoryItemService) {}

  @Get(':categoryId')
  @ApiOkResponse({ type: CategoryItem, isArray: true })
  getCategoryItems(@Param('categoryId') categoryId: number) {
    return this.categoryItemService.getAll(categoryId);
  }

  @Post()
  @ApiOkResponse({ type: CategoryItem })
  createCategoryItem(@Body() dto: CreateCategoryItemDto) {
    return this.categoryItemService.createOne(dto);
  }

  @Put(':categoryItemId')
  @ApiOkResponse({ type: CategoryItem })
  updateCategoryItem(
    @Param('categoryItemId') categoryItemId: number,
    @Body() body: UpdateCategoryItemDto,
  ) {
    return this.categoryItemService.updateOne(categoryItemId, body);
  }

  @Delete(':categoryItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategoryItem(@Param('categoryItemId') categoryItemId: number) {
    this.categoryItemService.deleteOne(categoryItemId);
  }
}
