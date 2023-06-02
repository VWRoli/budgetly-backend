import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from 'src/budget/entities';
import { Repository } from 'typeorm';
import { Account } from '../entities';
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

  async getAll(budgetId: number) {
    return await this.repository.find({
      where: { budgetId },
    });
  }

  async createOne(data: CreatAccountDto) {
    //check if budget exists
    const budget = await this.budgetRepository.findOne({
      where: {
        id: data.budgetId,
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

    // Save the account entity in the DB
    const savedAccount = await this.repository.save(account);

    await this.budgetRepository.save(budget);
    return savedAccount;
  }

  async updateOne(id: number, data: UpdateAccountDto) {
    const currentAccount = await this.repository.findOne({
      where: { id: id },
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

  async deleteOne(id: number) {
    try {
      const currentAccount = await this.repository.findOne({
        where: { id },
      });
      if (!currentAccount) {
        throw new NotFoundException('No account found with the provided id.');
      }
      //todo delete transactions
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
