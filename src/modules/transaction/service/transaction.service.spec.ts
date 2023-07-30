import { Repository } from 'typeorm';
import { Transaction, stubTransaction } from '../entities';
import { TransactionService } from './transaction.service';
import { Account } from '../../account/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Category } from '../../category/entities';
import { SubCategory } from '../../sub-category/entities';
import { NotFoundException } from '@nestjs/common';
import { AccountService } from '../../account/service';
import { Budget } from '../../budget/entities';
import { CategoryService } from '../../category/service';
import { SubCategoryService } from '../../sub-category/service';
import { stubTransactionResponse } from '../entities/response-transaction.stub';

const transactionStubResponse = stubTransactionResponse();
const transactionResponseStubs = [transactionStubResponse];

const transactionStub = stubTransaction();
const transactionStubs = [transactionStub];

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let accountRepository: Repository<Account>;
  let categoryRepository: Repository<Category>;
  let subCategoryRepository: Repository<SubCategory>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionService,
        AccountService,
        CategoryService,
        SubCategoryService,
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
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn().mockResolvedValue(transactionStub.category),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SubCategory),
          useValue: {
            findOne: jest.fn().mockResolvedValue(transactionStub.subCategory),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Budget),
          useClass: Repository,
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
    categoryRepository = moduleRef.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    subCategoryRepository = moduleRef.get<Repository<SubCategory>>(
      getRepositoryToken(SubCategory),
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

      expect(result).toEqual(transactionResponseStubs);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createOne', () => {
    it('should create a new transaction', async () => {
      jest
        .spyOn(accountRepository, 'findOne')
        .mockResolvedValue(transactionStub.account)
        .mockResolvedValueOnce(transactionStub.account)
        .mockResolvedValueOnce(transactionStub.account)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(transactionStub.account)
        .mockResolvedValueOnce(null);
      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(transactionStub.category)
        .mockResolvedValueOnce(transactionStub.category)
        .mockResolvedValueOnce(transactionStub.category)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(transactionStub.category)
        .mockResolvedValueOnce(null);
      jest
        .spyOn(subCategoryRepository, 'findOne')
        .mockResolvedValue(transactionStub.subCategory)
        .mockResolvedValueOnce(transactionStub.subCategory)
        .mockResolvedValueOnce(transactionStub.subCategory)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(transactionStub.subCategory)
        .mockResolvedValueOnce(null);

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
    it('should update an existing transaction', async () => {
      const accountId = transactionStub.accountId;

      const updatedTransaction: Transaction = {
        ...transactionStub,
        payee: 'Updated Payee',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(transactionStub);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTransaction);

      const result = await service.updateOne(accountId, updatedTransaction);

      expect(result).toEqual(updatedTransaction);

      expect(repository.save).toHaveBeenCalledWith(updatedTransaction);
    });

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
