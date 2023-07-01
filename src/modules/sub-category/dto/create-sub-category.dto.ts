import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example sub category', required: true })
  readonly title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  readonly categoryId: number;
}
