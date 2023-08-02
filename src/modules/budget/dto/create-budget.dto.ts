import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { ECurrency } from '../enum';
import { MAX_LENGTH, MIN_LENGTH } from '../../budget/budget.constants';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Name must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @ApiProperty({ example: 'Example budget', required: true })
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(ECurrency)
  @ApiProperty({ enum: ECurrency, enumName: 'ECurrency', required: true })
  readonly currency: ECurrency;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly userId: number;
}
