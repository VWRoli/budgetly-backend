import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example category item', required: true })
  readonly title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  readonly categoryId: number;
}
