import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example category', required: true })
  readonly title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: number;
}
