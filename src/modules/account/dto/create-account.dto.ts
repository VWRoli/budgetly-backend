import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { MAX_LENGTH, MIN_LENGTH } from '../../../utils/constants';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Name must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @ApiProperty({ example: 'Example account', required: true })
  readonly name: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly balance: number;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: number;
}
