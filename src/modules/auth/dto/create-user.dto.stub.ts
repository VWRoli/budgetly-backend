import { CreateUserDto } from './index';
import { stubLoginUserDto } from './login-user.dto.stub';

export const stubCreateUserDto = (): CreateUserDto => {
  return {
    ...stubLoginUserDto(),
    confirmPassword: 'StrongPassword1',
  };
};
