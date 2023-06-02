import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryItemDto } from './create-category-item.dto';

export class UpdateCategoryItemDto extends PartialType(CreateCategoryItemDto) {}
