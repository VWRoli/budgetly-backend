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
import { SubCategoryService } from '../service';
import { SubCategory } from '../entities';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from '../../auth/guard';

@ApiTags('sub-categories')
@UseGuards(JwtGuard, ThrottlerGuard)
@Controller('sub-categories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get(':categoryId')
  @ApiOkResponse({ type: SubCategory, isArray: true })
  getSubCategorys(@Param('categoryId') categoryId: number) {
    return this.subCategoryService.getAll(categoryId);
  }

  @Post()
  @ApiOkResponse({ type: SubCategory })
  createSubCategory(@Body() dto: CreateSubCategoryDto) {
    return this.subCategoryService.createOne(dto);
  }

  @Put(':subCategoryId')
  @ApiOkResponse({ type: SubCategory })
  updateSubCategory(
    @Param('subCategoryId') subCategoryId: number,
    @Body() body: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.updateOne(subCategoryId, body);
  }

  @Delete(':subCategoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSubCategory(@Param('subCategoryId') subCategoryId: number) {
    this.subCategoryService.deleteOne(subCategoryId);
  }
}
