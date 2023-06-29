import { stubAccount } from 'src/modules/account/entities';
import { Transaction } from './index';
import { stubCategory } from 'src/modules/category/entities';
import { stubCategoryItem } from 'src/modules/category-item/entities/category-item.entity.stub';

export const stubTransaction = (): Transaction => {
  return {
    id: 1,
    payee: 'Test Payee',
    account: stubAccount(),
    accountId: stubAccount().id,
    category: stubCategory(),
    categoryId: stubCategory().id,
    categoryItem: stubCategoryItem(),
    categoryItemId: stubCategoryItem().id,
    date: new Date('2022-01-01'),
    inflow: 1000,
    outflow: 500,
    createTimeStamp: new Date('2022-01-01'),
    updateTimeStamp: new Date('2022-01-02'),
    deleteTimeStamp: null,
  };
};
