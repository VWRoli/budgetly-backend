import { ApiProperty } from '@nestjs/swagger';

export class SubCategoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Test Category Item' })
  title: string;

  @ApiProperty({ example: 1000 })
  budgeted: number;

  @ApiProperty({ example: 500 })
  outflows: number;

  @ApiProperty({ example: 2000 })
  balance: number;
}
