import { IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MAX_LENGTH, MIN_LENGTH } from '../../../utils/constants';

export class UpdateSubCategoryDto {
  @IsString()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Title must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @ApiProperty({ example: 'Groceries', required: false })
  readonly title?: string;

  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  readonly categoryId?: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly balance: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly outflows: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly budgeted: number;
}
