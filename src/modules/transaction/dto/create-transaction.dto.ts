import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Store', required: true })
  readonly payee: string;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly accountId: number;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly categoryId: number;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  readonly categoryItemId: number;

  @IsDate()
  @ApiProperty({
    example: 'Fri Jun 02 2023 09:33:25 GMT+0200 (Central European Summer Time)',
    required: true,
  })
  readonly date: Date;

  @IsNumber()
  @ApiProperty({ example: 100 })
  readonly inflow: number;

  @IsNumber()
  @ApiProperty({ example: 100 })
  readonly outflow: number;
}
