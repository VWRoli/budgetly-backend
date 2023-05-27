import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ECurrency } from '../enum/budget.enum';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example budget', required: true })
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({ enum: ECurrency, enumName: 'ECurrency', required: true })
  readonly currency: ECurrency;

  @IsMongoId()
  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: true })
  readonly userId: string;
}
