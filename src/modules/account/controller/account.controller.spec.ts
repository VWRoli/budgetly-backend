import { Test } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../service';
import { stubAccount } from '../entities';

const accountStub = stubAccount();
const accountStubs = [accountStub];

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    }).compile();

    service = moduleRef.get<AccountService>(AccountService);
    controller = moduleRef.get<AccountController>(AccountController);
  });

  describe('getAccounts', () => {
    it('should return an array of accounts', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(accountStubs);

      const result = await controller.getAccounts(accountStub.budgetId);

      expect(result).toBe(accountStubs);
      expect(service.getAll).toHaveBeenCalledWith(accountStub.budgetId);
    });
  });

  describe('createAccount', () => {
    it('should create a new account', async () => {
      jest.spyOn(service, 'createOne').mockResolvedValue(accountStub);

      const result = await controller.createAccount(accountStub);

      expect(result).toBe(accountStub);
      expect(service.createOne).toHaveBeenCalledWith(accountStub);
    });
  });

  describe('updateAccount', () => {
    it('should update an existing account', async () => {
      jest.spyOn(service, 'updateOne').mockResolvedValue(accountStub);

      const result = await controller.updateAccount(
        accountStub.id,
        accountStub,
      );

      expect(result).toBe(accountStub);
      expect(service.updateOne).toHaveBeenCalledWith(
        accountStub.id,
        accountStub,
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete an existing account', async () => {
      jest.spyOn(service, 'deleteOne');

      controller.deleteAccount(accountStub.id);

      expect(service.deleteOne).toHaveBeenCalledWith(accountStub.id);
    });
  });
});
