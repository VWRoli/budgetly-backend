import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
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

  @IsString()
  @ApiProperty({
    example: 'd7bd1401-c0c9-4b54-8afd-33eda671921f',
    required: true,
  })
  readonly userId: string;
}
