import { stubCategory } from '../../category/entities';
import { SubCategory } from './index';

export const stubSubCategory = (): SubCategory => {
  return {
    id: 1,
    title: 'Test Category Item',
    budgeted: 1000,
    outflows: 500,
    balance: 500,
    category: stubCategory(),
    categoryId: stubCategory().id,
    transactions: [],
    transactionIds: [],
    createTimeStamp: new Date('2022-01-01'),
    updateTimeStamp: new Date('2022-01-02'),
    deleteTimeStamp: null,
  };
};
