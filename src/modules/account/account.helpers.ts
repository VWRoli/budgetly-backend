import { AccountResponseDto } from './dto';
import { Account } from './entities';

export const createAccountResponseDto = (
  account: Account,
): AccountResponseDto => {
  return {
    id: account.id,
    name: account.name,
    balance: account.balance,
  };
};
