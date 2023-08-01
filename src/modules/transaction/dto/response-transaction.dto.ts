import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  payee: string;

  @ApiProperty({ example: new Date() })
  date: Date;

  @ApiProperty({ example: 50 })
  inflow: number | null;

  @ApiProperty({ example: null })
  outflow: number | null;

  @ApiProperty({ example: 1 })
  budgetId: number;

  @ApiProperty({ example: { id: 2, name: 'Savings Account' } })
  account: {
    id: number;
    name: string;
  };

  @ApiProperty({ example: { id: 3, title: 'Groceries' } })
  category?: {
    id: number;
    title: string;
  };

  @ApiProperty({ example: { id: 4, title: 'Fruits' } })
  subCategory?: {
    id: number;
    title: string;
  };
}
