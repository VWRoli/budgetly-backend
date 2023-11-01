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
import { BudgetService } from '../../budget/service';

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
    private readonly budgetService: BudgetService,
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

    return responseTransactions.sort((a, b) => +b.date - +a.date);
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

    //if categoryId is 0 it is an income
    const income = data.categoryId === 0;
    //if categoryID is bigger than 0 and a valid number it is a transaction
    const isTransaction = data.categoryId >= 1;
    //else it is a transfer

    if (income) {
      const transaction: TransactionResponseDto =
        await this.createIncomeTransaction(data, account, budget);
      return transaction;
    } else if (isTransaction) {
      const transaction: TransactionResponseDto = await this.createTransaction(
        data,
        account,
        budget,
      );
      return transaction;
    } else {
      const transfer = this.createTransfer(data, account, budget);
      return transfer;
    }
  }

  async createIncomeTransaction(
    data: CreateTransactionDto,
    account: Account,
    budget: Budget,
  ) {
    // Create a new instance of the Transaction entity
    const transaction = this.repository.create({
      payee: data.payee,
      date: data.date,
      inflow: data.inflow,
      outflow: null,
      account: account, // Assign the account object to the 'account' property
      budget: budget, // Assign the account object to the 'budget' property
    });

    //update account
    await this.accountService.updateOne(account.id, {
      ...account,
      balance: account.balance + transaction.inflow,
    });

    //update budget with available amount
    await this.budgetService.updateOne(budget.id, {
      ...budget,
      availableToBudget: budget.availableToBudget + transaction.inflow,
    });

    //save transaction entity in DB
    const savedTransaction = await this.repository.save(transaction);

    //format response
    return createTransactionResponseDto(savedTransaction);
  }

  async createTransfer(
    data: CreateTransactionDto,
    sendingAccount: Account,
    budget: Budget,
  ): Promise<TransactionResponseDto> {
    const receiverAccount = await this.accountRepository.findOne({
      where: {
        name: data.payee,
        budget: { id: data.budgetId },
      },
    });
    const transferFrom = this.repository.create({
      payee: `Transfer: ${sendingAccount.name}`, //from account name
      date: data.date,
      inflow: data.inflow,
      outflow: data.outflow, //pays the amount
      account: sendingAccount,
      budget: budget,
    });

    //save transferFrom entity in DB
    const savedTransaction = await this.repository.save(transferFrom);

    if (data.inflow) {
      //update sending account
      await this.accountService.updateOne(sendingAccount.id, {
        ...sendingAccount,
        balance: sendingAccount.balance + data.inflow,
      });
      //update receiving account
      await this.accountService.updateOne(receiverAccount.id, {
        ...receiverAccount,
        balance: receiverAccount.balance - data.inflow,
      });
    }
    if (data.outflow) {
      //update sending account
      await this.accountService.updateOne(sendingAccount.id, {
        ...sendingAccount,
        balance: sendingAccount.balance - data.outflow,
      });
      //update receiving account
      await this.accountService.updateOne(receiverAccount.id, {
        ...receiverAccount,
        balance: receiverAccount.balance + data.outflow,
      });
    }

    const transferTo = this.repository.create({
      payee: `Transfer: ${receiverAccount.name}`, //to account name
      date: data.date,
      inflow: data.outflow, //receives the amount
      outflow: data.inflow,
      account: receiverAccount,
      budget: budget,
    });

    //save transferTo entity in DB
    await this.repository.save(transferTo);
    //format response
    return createTransactionResponseDto(savedTransaction);
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
      await this.accountService.updateOne(account.id, {
        ...account,
        balance: account.balance + transaction.inflow,
      });
      //update category
      await this.categoryService.updateOne(category.id, {
        ...category,
        balance: category.balance + transaction.inflow,
      });
      //update subcategory
      await this.subCategoryService.updateOne(subCategory.id, {
        ...subCategory,
        balance: subCategory.balance + transaction.inflow,
      });
    }
    if (data.outflow) {
      //update account
      await this.accountService.updateOne(account.id, {
        ...account,
        balance: account.balance - transaction.outflow,
      });
      //update category
      await this.categoryService.updateOne(category.id, {
        ...category,
        balance: category.balance - transaction.outflow,
        outflows: category.outflows + transaction.outflow,
      });
      //update subcategory
      await this.subCategoryService.updateOne(subCategory.id, {
        ...subCategory,
        balance: subCategory.balance - transaction.outflow,
        outflows: subCategory.outflows + transaction.outflow,
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
    currentTransaction.category = category; // Assign the category object to the 'category' property
    currentTransaction.subCategory = subCategory; // Assign the subCategory object to the 'subCategory' property

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
