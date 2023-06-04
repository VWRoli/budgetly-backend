import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { Transaction } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/modules/category/entities';
import { CategoryItem } from 'src/modules/category-item/entities';
import { Account } from 'src/modules/account/entities';
import { CommonService } from 'src/modules/common/service';

@Injectable()
export class TransactionService extends CommonService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    repository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(CategoryItem)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryItem)
    private categoryItemRepository: Repository<CategoryItem>,
  ) {
    super(repository);
  }

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
    //check if categoryItem exists
    const categoryItem = await this.categoryItemRepository.findOne({
      where: {
        id: data.categoryItemId,
      },
    });

    if (!categoryItem) {
      throw new NotFoundException(`No category item with the provided id`);
    }

    // Create a new instance of the Transaction entity
    const transaction = this.repository.create({
      payee: data.payee,
      category: category, // Assign the category object to the 'category' property
      categoryItem: categoryItem, // Assign the categoryItem object to the 'categoryItem' property
      date: data.date,
      inflow: data.inflow,
      outflow: data.outflow,
      account: account, // Assign the account object to the 'account' property
    });

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
    //check if categoryItem exists
    const categoryItem = await this.categoryItemRepository.findOne({
      where: {
        id: data.categoryItemId,
      },
    });

    if (!categoryItem) {
      throw new NotFoundException(`No category item with the provided id`);
    }

    // Update the properties of the currentBudget entity
    currentTransaction.payee = data.payee;
    currentTransaction.date = data.date;
    currentTransaction.inflow = data.inflow;
    currentTransaction.outflow = data.outflow;
    (currentTransaction.category = category), // Assign the category object to the 'category' property
      (currentTransaction.categoryItem = categoryItem), // Assign the categoryItem object to the 'categoryItem' property
      // Save the updated budget entity in the database
      await this.repository.save(currentTransaction);
    return currentTransaction;
  }
  async deleteOne(id: number) {
    return super.deleteOne(id);
  }
}
