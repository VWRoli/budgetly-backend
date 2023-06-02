import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example category', required: true })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  readonly budgetId: string;
}
