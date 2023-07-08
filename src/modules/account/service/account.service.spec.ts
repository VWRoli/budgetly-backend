import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from './account.service';
import { Account } from '../entities/account.entity';
import { Budget } from '../../budget/entities/budget.entity';
import { stubAccount } from '../entities';

const accountStub = stubAccount();
const accountStubs = [accountStub];

describe('AccountService', () => {
  let service: AccountService;
  let repository: Repository<Account>;
  let budgetRepository: Repository<Budget>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            findOne: jest.fn().mockResolvedValue(accountStub),
            save: jest.fn().mockResolvedValue(accountStub),
            find: jest.fn().mockResolvedValue(accountStub),
            create: jest.fn().mockResolvedValue(accountStub),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Budget),
          useClass: Repository,
        },
      ],
    }).compile();

    service = moduleRef.get<AccountService>(AccountService);
    repository = moduleRef.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
    budgetRepository = moduleRef.get<Repository<Budget>>(
      getRepositoryToken(Budget),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all accounts for a given budget', async () => {
      const budgetId = accountStub.budgetId;
      jest.spyOn(repository, 'find').mockResolvedValue(accountStubs);

      const result = await service.getAll(budgetId);

      expect(result).toEqual(accountStubs);
      expect(repository.find).toHaveBeenCalledWith({
        where: { budget: { id: budgetId } },
        relations: { transactions: true },
      });
    });
  });

  describe('createOne', () => {
    it('should create a new account', async () => {
      jest
        .spyOn(budgetRepository, 'findOne')
        .mockResolvedValue(accountStub.budget);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(accountStub);
      jest.spyOn(repository, 'save').mockResolvedValue(accountStub);

      const result = await service.createOne(accountStub);

      expect(result).toEqual(accountStub);
      expect(repository.save).toHaveBeenCalledWith(accountStub);
    });

    it('should throw a NotFoundException if budget does not exist', async () => {
      jest.spyOn(budgetRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOne(accountStub)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if account with the same name already exists', async () => {
      const budget = accountStub.budget;
      jest.spyOn(budgetRepository, 'findOne').mockResolvedValue(budget);
      jest.spyOn(repository, 'findOne').mockResolvedValue(accountStub);

      await expect(service.createOne(accountStub)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('updateOne', () => {
    //todo it('should update an existing account', async () => {
    //   const accountId = accountStub.id;
    //   const updateAccountDto: UpdateAccountDto = {
    //     name: 'Updated Account',
    //     budgetId: accountStub.budgetId,
    //   };

    //   const updatedAccount = { ...accountStub, name: 'Updated Account' };
    //   jest.spyOn(repository, 'findOne').mockResolvedValue(accountStub);
    //   jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    //   jest.spyOn(repository, 'save').mockResolvedValue(updatedAccount);

    //   const result = await service.updateOne(accountId, updateAccountDto);

    //   expect(result).toEqual(updatedAccount);

    //   expect(repository.save).toHaveBeenCalledWith(updatedAccount);
    // });

    it('should throw a NotFoundException if account does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateOne(accountStub.id, accountStub),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a ConflictException if another account with the same name already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(accountStub);

      await expect(
        service.updateOne(accountStub.id, accountStub),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('deleteOne', () => {
    it('should delete an existing account', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(accountStub);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      await service.deleteOne(accountStub.id);

      expect(repository.softDelete).toHaveBeenCalledWith(accountStub.id);
    });

    it('should throw a NotFoundException if account does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteOne(accountStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
