import { ApiProperty } from '@nestjs/swagger';
import { ECurrency, ELocale } from '../../budget/enum';

export class BudgetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Example budget' })
  name: string;

  @ApiProperty({ example: ELocale.DE })
  locale: ELocale;

  @ApiProperty({ example: ECurrency.EUR })
  currency: ECurrency;
}
