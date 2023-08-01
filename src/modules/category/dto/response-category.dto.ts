import { ApiProperty } from '@nestjs/swagger';
import { SubCategoryResponseDto } from '../../sub-category/dto';

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Test category' })
  title: string;

  @ApiProperty({ example: 1000 })
  budgeted: number;

  @ApiProperty({ example: 500 })
  outflows: number;

  @ApiProperty({ example: 2000 })
  balance: number;

  @ApiProperty({ example: [SubCategoryResponseDto] })
  subCategories: SubCategoryResponseDto[];
}
