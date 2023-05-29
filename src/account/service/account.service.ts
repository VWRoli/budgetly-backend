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

    //save account entity in DB
    return await this.repository.save(account);
  }
}
