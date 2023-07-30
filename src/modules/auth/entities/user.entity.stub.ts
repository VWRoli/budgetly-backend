import { User } from './index';

export const stubUser = (): User => {
  return {
    id: 1,
    email: 'test@example.com',
    hash: 'passwordHash',
    budgets: [],
    defaultBudgetId: null,
    createTimeStamp: new Date('2022-01-01'),
    updateTimeStamp: new Date('2022-01-02'),
    deleteTimeStamp: null,
  };
};
