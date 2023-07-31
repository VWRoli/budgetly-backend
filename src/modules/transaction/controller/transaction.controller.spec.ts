import { Repository } from 'typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../service';
import { Transaction, stubTransaction } from '../entities';
import { Account } from '../../account/entities';
import { Category } from '../../category/entities';
import { SubCategory } from '../../sub-category/entities';
import { AccountService } from '../../account/service';
import { CategoryService } from '../../category/service';
import { SubCategoryService } from '../../sub-category/service';
import { Budget } from '../../budget/entities';
import { stubTransactionResponse } from '../entities/response-transaction.stub';

const transactionStub = stubTransaction();
const transactionStubResponse = stubTransactionResponse();
const transactionResponseStubs = [transactionStubResponse];
const transactionStubs = [transactionStub];

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: +process.env.THROTTLER_TTL,
          limit: +process.env.THROTTLER_LIMIT,
        }),
      ],
      controllers: [TransactionController],
      providers: [
        TransactionService,
        AccountService,
        CategoryService,
        SubCategoryService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Account),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Category),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(SubCategory),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Budget),
          useClass: Repository,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Mock the ThrottlerGuard
      .compile();

    service = moduleRef.get<TransactionService>(TransactionService);
    controller = moduleRef.get<TransactionController>(TransactionController);
    repository = moduleRef.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTransactions', () => {
    it('should return an array of transactions, search by accountID', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(transactionResponseStubs);
      const result = await controller.getTransactionsByAccountId(
        transactionStub.accountId,
      );

      expect(result).toEqual(transactionResponseStubs);
    });
    it('should return an array of transactions, search by budgetId', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(transactionResponseStubs);
      const result = await controller.getTransactionsByBudgetId(
        transactionStub.budgetId,
      );

      expect(result).toEqual(transactionResponseStubs);
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      jest.spyOn(service, 'createOne').mockResolvedValue(transactionStub);
      const result = await controller.createTransaction(transactionStub);

      expect(result).toEqual(transactionStub);
    });
  });

  describe('updateTransaction', () => {
    it('should update an existing transaction', async () => {
      jest.spyOn(service, 'updateOne').mockResolvedValue(transactionStub);
      const result = await controller.updateTransaction(
        transactionStub.id,
        transactionStub,
      );

      expect(result).toEqual(transactionStub);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete an existing transaction', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const result = await controller.deleteTransaction(transactionStub.id);

      expect(result).toBeUndefined();
    });
  });
});
