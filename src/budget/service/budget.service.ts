import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from '../dto';
import { Budget } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { Account } from 'src/account/entities';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private repository: Repository<Budget>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async getAll(userId: string) {
    return await this.repository.find({
      where: { userId: userId },
    });
  }
  async createOne(data: CreateBudgetDto) {
    //check if user exists
    const user = await this.userRepository.findOne({
      where: {
        id: data.userId,
      },
    });
    if (!user) {
      throw new NotFoundException(`No user with the provided id`);
    }
    // check if data is already created
    const existingBudget = await this.repository.findOne({
      where: { userId: data.userId, currency: data.currency },
    });
    if (existingBudget) {
      throw new ConflictException(
        `You already have a budget with ${data.currency} currency.`,
      );
    }
    // Create a new instance of the Budget entity
    const budget = this.repository.create({
      name: data.name,
      currency: data.currency,
    });

    //save budget entity in DB
    return await this.repository.save(budget);
  }

  async updateOne(id: string, data: UpdateBudgetDto) {
    const currentBudget = await this.repository.findOne({
      where: { id: id },
    });
    if (!currentBudget) {
      throw new NotFoundException('No budget found with the provided id.');
    }
    // Update the properties of the currentBudget entity
    currentBudget.name = data.name;
    currentBudget.currency = data.currency;
    // Save the updated budget entity in the database
    await this.repository.save(currentBudget);
    return currentBudget;
  }

  async deleteOne(id: string) {
    try {
      const currentBudget = await this.repository.findOne({
        where: { id },
        relations: { accounts: true }, // Specify the relations to be loaded
      });
      if (!currentBudget) {
        throw new NotFoundException('No budget found with the provided id.');
      }
      console.log(currentBudget);
      // Delete the associated accounts
      for (const account of currentBudget.accounts) {
        await this.accountRepository.delete(account.id);
      }
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
