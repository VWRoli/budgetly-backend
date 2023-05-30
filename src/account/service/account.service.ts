import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from 'src/budget/entities';
import { Repository } from 'typeorm';
import { Account } from '../entities';
import { ObjectId } from 'mongodb';
import { CreatAccountDto } from '../dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private repository: Repository<Account>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  async getAll(budgetId: string) {
    return await this.repository.find({
      where: { budgetId: new ObjectId(budgetId) },
    });
  }

  async createOne(data: CreatAccountDto): Promise<Account> {
    //check if budget exists
    const budget = await this.budgetRepository.findOne({
      where: {
        _id: new ObjectId(data.budgetId),
      },
      loadRelationIds: {
        relations: ['accounts'],
      },
    });

    if (!budget) {
      throw new NotFoundException(`No budget with the provided id`);
    }

    // check if data is already created
    const existingAccount = await this.repository.findOne({
      where: { name: data.name },
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
    });

    account.budget = budget; // Assign the budget relation
    account.budgetId = new ObjectId(data.budgetId); // Assign the user relation

    // Save the account entity in the DB
    const savedAccount = await this.repository.save(account);

    console.log(budget);
    // Update the parent budget with the new account's ID
    budget.accounts.push(savedAccount);
    budget.accountIds.push(savedAccount._id);
    await this.budgetRepository.save(budget);

    return savedAccount;
  }

  async updateOne(id: string, data: UpdateAccountDto): Promise<Account> {
    const currentAccount = await this.repository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!currentAccount) {
      throw new NotFoundException('No Account found with the provided id.');
    }
    // Update the properties of the currentAccount entity
    currentAccount.name = data.name;

    // Save the updated Account entity in the database
    await this.repository.save(currentAccount);

    return currentAccount;
  }

  async deleteOne(id: string) {
    try {
      const currentAccount = await this.repository.findOne({
        where: { _id: new ObjectId(id) },
      });

      if (!currentAccount) {
        throw new NotFoundException('No account found with the provided id.');
      }
      //todo delete transactions
      await this.repository.delete(new ObjectId(id));
    } catch (error) {
      throw error;
    }
  }
}
