import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { isInflowOrOutflowNull } from '../decorators';
import { MAX_LENGTH, MIN_LENGTH } from '../../../utils/constants';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, {
    message: `Payee must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
  })
  @ApiProperty({ example: 'Store', required: true })
  readonly payee: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  readonly isTransfer: boolean;

  @ApiProperty({ example: 1, required: false, nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly transferAccountId: number;

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
