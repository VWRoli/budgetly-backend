import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { MAX_LENGTH, MIN_LENGTH } from '../../../utils/constants';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Title must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @ApiProperty({ example: 'Example category', required: true })
  readonly title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: number;
}
