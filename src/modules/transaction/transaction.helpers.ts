import { Transaction } from './entities';
import { TransactionResponseDto } from './dto';

export const createTransactionResponseDto = (
  transaction: Transaction,
): TransactionResponseDto => {
  return {
    id: transaction.id,
    payee: transaction.payee,
    date: transaction.date,
    inflow: transaction.inflow,
    outflow: transaction.outflow,
    budgetId: transaction.budget.id,
    account: {
      id: transaction.account.id,
      name: transaction.account.name,
    },
    category: {
      id: transaction.category.id,
      title: transaction.category.title,
    },
    subCategory: {
      id: transaction.subCategory.id,
      title: transaction.subCategory.title,
    },
  };
};
