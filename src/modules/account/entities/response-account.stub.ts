import { AccountResponseDto } from '../dto';

export const stubAccountResponse = (): AccountResponseDto => {
  return {
    id: 1,
    name: 'Test Account',
    balance: 0,
  };
};
