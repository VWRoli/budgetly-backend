import { Budget } from 'src/modules/budget/entities';
import { ECurrency, ELocale } from '../budget/enum';
import { BudgetResponseDto } from 'src/modules/budget/dto';

export function setLoacle(currency: ECurrency) {
  switch (currency) {
    case ECurrency.EUR:
      return ELocale.DE;
    case ECurrency.USD:
      return ELocale.US;
    case ECurrency.HUF:
      return ELocale.HU;
    case ECurrency.GBP:
      return ELocale.GB;
    default:
      return ELocale.DE;
  }
}

export const createBudgetResponseDto = (budget: Budget): BudgetResponseDto => {
  return {
    id: budget.id,
    name: budget.name,
    locale: budget.locale,
    currency: budget.currency,
  };
};
