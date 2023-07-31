import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { isInflowOrOutflowNull } from '../decorators';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
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
  @IsOptional()
  @isInflowOrOutflowNull()
  @ApiProperty({ example: 100 })
  readonly inflow: number;

  @IsNumber()
  @IsOptional()
  @isInflowOrOutflowNull()
  @ApiProperty({ example: 100 })
  readonly outflow: number;
}
