import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly balance: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly outflows: number;
}
