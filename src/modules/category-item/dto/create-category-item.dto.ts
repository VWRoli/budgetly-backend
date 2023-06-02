import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Example category item', required: true })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  readonly categoryId: string;
}
