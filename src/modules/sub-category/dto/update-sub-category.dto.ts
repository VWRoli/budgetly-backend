import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly balance: number;
}
