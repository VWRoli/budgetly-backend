import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { isInflowOrOutflowNull } from '../decorators';
import {
  MAX_LENGTH,
  MIN_LENGTH,
} from '../../transaction/transaction.constants';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Title must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @ApiProperty({ example: 'Store', required: true })
  readonly payee: string;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: number;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly accountId: number;

  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  readonly categoryId?: number;

  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  readonly subCategoryId?: number;

  @IsNotEmpty()
  @ApiProperty({
    example: '2023-06-03',
    required: true,
  })
  @Type(() => Date)
  readonly date: Date;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @isInflowOrOutflowNull()
  @ApiProperty({ example: 100 })
  readonly inflow: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @isInflowOrOutflowNull()
  @ApiProperty({ example: 100 })
  readonly outflow: number;
}
