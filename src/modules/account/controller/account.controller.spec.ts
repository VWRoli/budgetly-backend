import { Test } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../service';
import { Account, stubAccount } from '../entities';
import { Budget } from '../../budget/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { stubAccountResponse } from '../../account/entities';

const accountResponseStub = stubAccountResponse();
const accountResponseStubs = [accountResponseStub];

const accountStub = stubAccount();

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;
  let repository: Repository<Account>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: +process.env.THROTTLER_TTL,
          limit: +process.env.THROTTLER_LIMIT,
        }),
      ],
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Budget),
          useValue: jest.fn(),
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Mock the ThrottlerGuard
      .compile();

    service = moduleRef.get<AccountService>(AccountService);
    controller = moduleRef.get<AccountController>(AccountController);
    repository = moduleRef.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAccounts', () => {
    it('should return an array of accounts', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(accountResponseStubs);
      const result = await controller.getAccounts(accountStub.budgetId);

      expect(result).toEqual(accountResponseStubs);
    });
  });

  describe('createAccount', () => {
    it('should create a new account', async () => {
      jest.spyOn(service, 'createOne').mockResolvedValue(accountResponseStub);
      const result = await controller.createAccount(accountStub);

      expect(result).toEqual(accountResponseStub);
    });
  });

  describe('updateAccount', () => {
    it('should update an existing account', async () => {
      jest.spyOn(service, 'updateOne').mockResolvedValue(accountResponseStub);
      const result = await controller.updateAccount(
        accountStub.id,
        accountStub,
      );

      expect(result).toEqual(accountResponseStub);
    });
  });

  describe('deleteAccount', () => {
    it('should delete an existing account', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const result = await controller.deleteAccount(accountStub.id);

      expect(result).toBeUndefined();
    });
  });
});
