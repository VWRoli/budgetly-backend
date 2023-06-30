import { LoginUserDto } from './index';

export const stubLoginUserDto = (): LoginUserDto => {
  return {
    email: 'email@budgetly.com',
    password: 'StrongPassword1',
  };
};
