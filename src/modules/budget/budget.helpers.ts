import { ECurrency, ELocale } from '../budget/enum';

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
