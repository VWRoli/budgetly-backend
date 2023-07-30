import { IResponseTransaction } from 'src/modules/transaction/response-transaction.interface';

export const stubTransactionResponse = (): IResponseTransaction => {
  return {
    id: 1,
    payee: 'Test Payee',
    date: new Date('2022-01-01'),
    inflow: 1000,
    outflow: 500,
    budget: {
      id: 1,
    },
    account: {
      id: 1,
      name: 'Test Account',
    },
    category: {
      id: 1,
      title: 'Test Category',
    },
    subCategory: {
      id: 1,
      title: 'Test Category Item',
    },
  };
};
