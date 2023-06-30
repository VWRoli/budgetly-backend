import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services';
import { stubCreateUserDto, stubLoginUserDto } from '../dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User, stubUser } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SALT_WORK_FACTOR } from '../auth.constants';

const userStub = stubUser();
const loginUserStubDto = stubLoginUserDto();
const createUserStubDto = stubCreateUserDto();

const repositoryMock = {
  findOne: jest.fn(),
  softDelete: jest.fn(),
  create: jest.fn().mockReturnValue(userStub),
  save: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({}), ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Mock the ThrottlerGuard
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signUp with the provided DTO', async () => {
      const signUpSpy = jest.spyOn(service, 'signUp');
      const expectedResult = { access_token: '' };

      const result = await controller.signup(createUserStubDto);

      expect(signUpSpy).toHaveBeenCalledWith(createUserStubDto);

      expect(result.access_token).toBeDefined();
    });

    it('should return the result of authService.signUp', async () => {
      const expectedResult = { access_token: '' };

      jest.spyOn(service, 'signUp').mockResolvedValue(expectedResult);

      const result = await controller.signup(createUserStubDto);

      expect(result.access_token).toBeDefined();
    });
  });

  describe('signin', () => {
    it('should call authService.signIn with the provided DTO', async () => {
      const signInSpy = jest.spyOn(service, 'signIn');

      const mockedUser = {
        email: loginUserStubDto.email,
        hash: await bcrypt.hash(loginUserStubDto.password, SALT_WORK_FACTOR),
      };

      jest.spyOn(repositoryMock, 'findOne').mockResolvedValueOnce(mockedUser);

      const result = await controller.signin(loginUserStubDto);
      expect(signInSpy).toHaveBeenCalledWith(loginUserStubDto);
      expect(result.access_token).toBeDefined();
    });
  });
});
