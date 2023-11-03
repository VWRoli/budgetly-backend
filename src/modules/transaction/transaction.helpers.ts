import { Transaction } from './entities';
import { TransactionResponseDto } from './dto';

export const createTransactionResponseDto = (
  transaction: Transaction,
): TransactionResponseDto => {
  if (transaction.isTransfer) {
    return {
      id: transaction.id,
      payee: transaction.payee,
      isTransfer: transaction.isTransfer,
      transferAccountId: transaction.transferAccountId,
      date: transaction.date,
      inflow: transaction.inflow,
      outflow: transaction.outflow,
      budgetId: transaction.budget.id,
      account: {
        id: transaction.account.id,
        name: transaction.account.name,
      },
    };
  } else {
    return {
      id: transaction.id,
      payee: transaction.payee,
      isTransfer: transaction.isTransfer,
      transferAccountId: transaction.transferAccountId,
      date: transaction.date,
      inflow: transaction.inflow,
      outflow: transaction.outflow,
      budgetId: transaction.budget.id,
      account: {
        id: transaction.account.id,
        name: transaction.account.name,
      },
      category: {
        id: transaction.category?.id,
        title: transaction.category?.title || getIncomeMonth(transaction.date),
      },
      subCategory: {
        id: transaction.subCategory?.id,
        title: transaction.subCategory?.title,
      },
    };
  }
};

export function getIncomeMonth(date: Date) {
  const month = date.toLocaleString('default', { month: 'long' });
  return `Income for ${month}`;
}
