import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { Transaction } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../account/entities';
import { Category } from '../../category/entities';
import { Budget } from '../../budget/entities';
import { SubCategory } from '../../sub-category/entities';
import { AccountService } from '../../account/service';
import { SubCategoryService } from '../../sub-category/service';
import { CategoryService } from '../../category/service';
import { TransactionResponseDto } from '../dto';
import { createTransactionResponseDto } from '../transaction.helpers';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
  ) {}

  async getAll(findCondition: any) {
    const transactions = await this.repository.find({
      ...findCondition,
      relations: {
        account: true,
        category: true,
        subCategory: true,
        budget: true,
      },
      select: ['id', 'payee', 'date', 'inflow', 'outflow'],
    });
    const responseTransactions: TransactionResponseDto[] = transactions.map(
      (txn) => createTransactionResponseDto(txn),
    );

    return responseTransactions;
  }

  async createOne(data: CreateTransactionDto) {
    //check if account exists
    const budget = await this.budgetRepository.findOne({
      where: {
        id: data.budgetId,
      },
    });

    if (!budget) {
      throw new NotFoundException(`No budget with the provided id`);
    }

    //check if account exists
    const account = await this.accountRepository.findOne({
      where: {
        id: data.accountId,
      },
    });

    if (!account) {
      throw new NotFoundException(`No account with the provided id`);
    }

    //if there is no category id then it is a transfer between accounts
    const isTransfer = !data.categoryId;
    if (isTransfer) {
      const transfer = this.createTransfer(data, account, budget);
      return transfer;
    } else {
      const transaction: TransactionResponseDto = await this.createTransaction(
        data,
        account,
        budget,
      );
      return transaction;
    }
  }
  async createTransfer(
    data: CreateTransactionDto,
    account: Account,
    budget: Budget,
  ) {
    console.log('transfer');
  }

  async createTransaction(
    data: CreateTransactionDto,
    account: Account,
    budget: Budget,
  ): Promise<TransactionResponseDto> {
    //check if category exists
    const category = await this.categoryRepository.findOne({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`No category with the provided id`);
    }
    //check if subCategory exists
    const subCategory = await this.subCategoryRepository.findOne({
      where: {
        id: data.subCategoryId,
      },
    });

    if (!subCategory) {
      throw new NotFoundException(`No sub category with the provided id`);
    }

    // Create a new instance of the Transaction entity
    const transaction = this.repository.create({
      payee: data.payee,
      category: category, // Assign the category object to the 'category' property
      subCategory: subCategory, // Assign the subCategory object to the 'subCategory' property
      date: data.date,
      inflow: data.inflow,
      outflow: data.outflow,
      account: account, // Assign the account object to the 'account' property
      budget: budget, // Assign the account object to the 'budget' property
    });

    if (data.inflow) {
      //update account
      await this.accountService.updateOne(transaction.accountId, {
        ...account,
        balance: account.balance + transaction.inflow,
      });
      //update category
      await this.categoryService.updateOne(transaction.categoryId, {
        ...category,
        balance: category.balance + transaction.inflow,
      });
      //update subcategory
      await this.subCategoryService.updateOne(transaction.subCategoryId, {
        ...subCategory,
        balance: subCategory.balance + transaction.inflow,
      });
    }

    if (data.outflow) {
      //update account
      await this.accountService.updateOne(transaction.accountId, {
        ...account,
        balance: account.balance - transaction.outflow,
      });
      //update category
      await this.categoryService.updateOne(transaction.categoryId, {
        ...category,
        balance: category.balance - transaction.outflow,
      });
      //update subcategory
      await this.subCategoryService.updateOne(transaction.subCategoryId, {
        ...subCategory,
        balance: subCategory.balance - transaction.outflow,
      });
    }
    //save transaction entity in DB
    const savedTransaction = await this.repository.save(transaction);

    //format response
    return createTransactionResponseDto(savedTransaction);
  }

  async updateOne(id: number, data: UpdateTransactionDto) {
    const currentTransaction = await this.repository.findOne({
      where: { id },
    });
    if (!currentTransaction) {
      throw new NotFoundException('No transaction found with the provided id.');
    }

    //check if category exists
    const category = await this.categoryRepository.findOne({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException(`No category with the provided id`);
    }
    //check if subCategory exists
    const subCategory = await this.subCategoryRepository.findOne({
      where: {
        id: data.subCategoryId,
      },
    });

    if (!subCategory) {
      throw new NotFoundException(`No sub category with the provided id`);
    }

    // Update the properties of the currentBudget entity
    currentTransaction.payee = data.payee;
    currentTransaction.date = data.date;
    currentTransaction.inflow = data.inflow;
    currentTransaction.outflow = data.outflow;
    (currentTransaction.category = category), // Assign the category object to the 'category' property
      (currentTransaction.subCategory = subCategory); // Assign the subCategory object to the 'subCategory' property

    //save transaction entity in DB
    const savedTransaction = await this.repository.save(currentTransaction);

    //format response
    return createTransactionResponseDto(savedTransaction);
  }
  async deleteOne(id: number) {
    try {
      const currentTransaction = await this.repository.findOne({
        where: { id },
      });

      if (!currentTransaction) {
        throw new NotFoundException(
          'No transaction found with the provided id.',
        );
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
