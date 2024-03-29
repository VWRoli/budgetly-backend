import { stubUser } from '../../auth/entities';
import { ECurrency, ELocale } from '../enum';
import { Budget } from './index';

export const stubBudget = (): Budget => {
  return {
    id: 1,
    name: 'Test Budget',
    availableToBudget: 0,
    currency: ECurrency.USD,
    locale: ELocale.US,
    user: stubUser(),
    userId: stubUser().id,
    accounts: [],
    transactions: [],
    categories: [],
    createTimeStamp: new Date('2022-01-01'),
    updateTimeStamp: new Date('2022-01-02'),
    deleteTimeStamp: null,
  };
};
