import { stubBudget } from '../../budget/entities';
import { Account } from './index';

export const stubAccount = (): Account => {
  return {
    id: 1,
    name: 'Test Account',
    budget: stubBudget(),
    budgetId: stubBudget().id,
    transactions: [],
    transactionIds: [],
    balance: 0,
    createTimeStamp: new Date('2022-01-01'),
    updateTimeStamp: new Date('2022-01-02'),
    deleteTimeStamp: null,
  };
};
