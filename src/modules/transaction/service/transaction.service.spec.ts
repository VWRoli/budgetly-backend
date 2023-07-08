import { Repository } from 'typeorm';
import { Transaction, stubTransaction } from '../entities';
import { TransactionService } from './transaction.service';
import { Account } from '../../account/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Category } from '../../category/entities';
import { SubCategory } from '../../sub-category/entities';
import { NotFoundException } from '@nestjs/common';

const transactionStub = stubTransaction();
const transactionStubs = [transactionStub];

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let accountRepository: Repository<Account>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn().mockResolvedValue(transactionStub),
            save: jest.fn().mockResolvedValue(transactionStub),
            find: jest.fn().mockResolvedValue(transactionStub),
            create: jest.fn().mockResolvedValue(transactionStub),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Account),
          useValue: {
            findOne: jest.fn().mockResolvedValue(transactionStub.account),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn().mockResolvedValue(transactionStub.category),
          },
        },
        {
          provide: getRepositoryToken(SubCategory),
          useValue: {
            findOne: jest.fn().mockResolvedValue(transactionStub.subCategory),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<TransactionService>(TransactionService);
    repository = moduleRef.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    accountRepository = moduleRef.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all transactions for a given budget', async () => {
      const accountId = transactionStub.accountId;
      jest.spyOn(repository, 'find').mockResolvedValue(transactionStubs);

      const result = await service.getAll(accountId);

      expect(result).toEqual(transactionStubs);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createOne', () => {
    it('should create a new transaction', async () => {
      jest
        .spyOn(accountRepository, 'findOne')
        .mockResolvedValue(transactionStub.account);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(transactionStub);
      jest.spyOn(repository, 'save').mockResolvedValue(transactionStub);

      const result = await service.createOne(transactionStub);

      expect(result).toEqual(transactionStub);
      expect(repository.save).toHaveBeenCalledWith(transactionStub);
    });

    it('should throw a NotFoundException if transaction does not exist', async () => {
      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createOne(transactionStub)).rejects.toThrowError(
        NotFoundException,
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

    it('should throw a NotFoundException if transaction does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateOne(transactionStub.id, transactionStub),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteOne', () => {
    it('should delete an existing transaction', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(transactionStub);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      await service.deleteOne(transactionStub.id);

      expect(repository.softDelete).toHaveBeenCalledWith(transactionStub.id);
    });

    it('should throw a NotFoundException if transaction does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteOne(transactionStub.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
