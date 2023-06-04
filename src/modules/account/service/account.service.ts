import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from 'src/modules/budget/entities';
import { Not, Repository } from 'typeorm';
import { Account } from '../entities';
import { CreatAccountDto } from '../dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { Transaction } from 'src/modules/transaction/entities';
import { CommonService } from 'src/modules/common/service';

@Injectable()
export class AccountService extends CommonService<Account> {
  constructor(
    @InjectRepository(Account)
    repository: Repository<Account>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {
    super(repository);
  }

  async getAll(budgetId: number) {
    return await this.repository.find({
      where: { budget: { id: budgetId } },
      relations: { transactions: true },
    });
  }

  async createOne(data: CreatAccountDto) {
    //check if budget exists
    const budget = await this.budgetRepository.findOne({
      where: {
        id: data.budgetId,
      },
    });
    if (!budget) {
      throw new NotFoundException(`No budget with the provided id`);
    }
    // check if data is already created
    const existingAccount = await this.repository.findOne({
      where: {
        name: data.name,
        budget: { id: budget.id }, // Filter by the budget's ID
      },
    });
    if (existingAccount) {
      throw new ConflictException(
        `You already have an account with the same name`,
      );
    }

    // Create a new instance of the Account entity
    const account = this.repository.create({
      name: data.name,
      balance: 0,
      budget: budget, // Assign the budget object to the 'budget' property
    });

    // Save the account entity in the DB
    return await this.repository.save(account);
  }

  async updateOne(id: number, data: UpdateAccountDto) {
    const currentAccount = await this.repository.findOne({
      where: { id },
    });
    if (!currentAccount) {
      throw new NotFoundException('No Account found with the provided id.');
    }
    // check if data is already created
    const existingAccount = await this.repository.findOne({
      where: {
        id: Not(id), // Exclude the currentAccount ID from the results
        name: data.name,
        budget: { id: data.budgetId }, // Filter by the budget's ID
      },
    });
    if (existingAccount) {
      throw new ConflictException(
        `You already have an account with the same name.`,
      );
    }

    // Update the properties of the currentAccount entity
    currentAccount.name = data.name;

    // Save the updated Account entity in the database
    await this.repository.save(currentAccount);
    return currentAccount;
  }

  async deleteOne(id: number) {
    return super.deleteOne(id);
  }
}
