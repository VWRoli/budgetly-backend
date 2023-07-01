import { stubBudget } from '../../budget/entities';
import { Category } from './index';

export const stubCategory = (): Category => {
  return {
    id: 1,
    title: 'Test Category',
    budgeted: 1000,
    outflows: 500,
    balance: 500,
    budget: stubBudget(),
    budgetId: stubBudget().id,
    transactions: [],
    transactionIds: [],
    subCategorys: [],
    subCategoryIds: [],
    createTimeStamp: new Date('2022-01-01'),
    updateTimeStamp: new Date('2022-01-02'),
    deleteTimeStamp: null,
  };
};
