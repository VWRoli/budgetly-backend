import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ECurrency } from '../enum';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example budget', required: true })
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(ECurrency)
  @ApiProperty({ enum: ECurrency, enumName: 'ECurrency', required: true })
  readonly currency: ECurrency;

  @IsNumber()
  @ApiProperty({
    example: 1,
    required: true,
  })
  readonly userId: number;
}
