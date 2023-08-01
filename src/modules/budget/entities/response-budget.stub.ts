import { ECurrency, ELocale } from '../../budget/enum';
import { BudgetResponseDto } from '../dto';

export const stubBudgetResponse = (): BudgetResponseDto => {
  return {
    id: 1,
    name: 'Test Budget',
    currency: ECurrency.USD,
    locale: ELocale.US,
  };
};
