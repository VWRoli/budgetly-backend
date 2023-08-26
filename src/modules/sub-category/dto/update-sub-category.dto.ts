import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MAX_LENGTH, MIN_LENGTH } from '../../../utils/constants';

export class UpdateSubCategoryDto {
  @IsString()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Title must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @IsOptional()
  @ApiProperty({ example: 'Groceries', required: false })
  readonly title?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  readonly categoryId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  readonly balance?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  readonly outflows?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  readonly budgeted?: number;
}
