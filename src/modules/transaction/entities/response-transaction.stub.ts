import { TransactionResponseDto } from '../../transaction/dto';

export const stubTransactionResponse = (): TransactionResponseDto => {
  return {
    id: 1,
    payee: 'Test Payee',
    date: new Date('2022-01-01'),
    inflow: 1000,
    outflow: 500,
    budgetId: 1,
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
