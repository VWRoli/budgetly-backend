import { stubAccount } from '../../account/entities';
import { stubSubCategory } from '../../sub-category/entities/';
import { stubCategory } from '../../category/entities';
import { Transaction } from './index';
import { stubBudget } from '../../budget/entities';

export const stubTransaction = (): Transaction => {
  return {
    id: 1,
    payee: 'Test Payee',
    account: stubAccount(),
    accountId: stubAccount().id,
    budget: stubBudget(),
    budgetId: stubBudget().id,
    category: stubCategory(),
    categoryId: stubCategory().id,
    subCategory: stubSubCategory(),
    subCategoryId: stubSubCategory().id,
    date: new Date('2022-01-01'),
    inflow: 1000,
    outflow: 500,
    createTimeStamp: new Date('2022-01-01'),
    updateTimeStamp: new Date('2022-01-02'),
    deleteTimeStamp: null,
  };
};
