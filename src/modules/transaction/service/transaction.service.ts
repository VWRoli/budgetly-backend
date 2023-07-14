import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { Transaction } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../account/entities';
import { Category } from '../../category/entities';
import { SubCategory } from '../../sub-category/entities';
import { AccountService } from '../../account/service';
import { SubCategoryService } from '../../sub-category/service';
import { CategoryService } from '../../category/service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
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

  async getAll(accountId: number) {
    return await this.repository.find({
      where: { account: { id: accountId } },
    });
  }
  async createOne(data: CreateTransactionDto) {
    //check if account exists
    const account = await this.accountRepository.findOne({
      where: {
        id: data.accountId,
      },
    });

    if (!account) {
      throw new NotFoundException(`No account with the provided id`);
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

    // Create a new instance of the Transaction entity
    const transaction = this.repository.create({
      payee: data.payee,
      category: category, // Assign the category object to the 'category' property
      subCategory: subCategory, // Assign the subCategory object to the 'subCategory' property
      date: data.date,
      inflow: data.inflow,
      outflow: data.outflow,
      account: account, // Assign the account object to the 'account' property
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
    return await this.repository.save(transaction);
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
      (currentTransaction.subCategory = subCategory), // Assign the subCategory object to the 'subCategory' property
      // Save the updated budget entity in the database
      await this.repository.save(currentTransaction);
    return currentTransaction;
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
