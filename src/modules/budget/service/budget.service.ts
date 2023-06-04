import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from '../dto';
import { Budget } from '../entities';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { Account } from 'src/modules/account/entities';
import { Category } from 'src/modules/category/entities';
import { CommonService } from 'src/modules/common/service';

@Injectable()
export class BudgetService extends CommonService<Budget> {
  constructor(
    @InjectRepository(Budget)
    repository: Repository<Budget>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(repository);
  }

  async getAll(userId: number) {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations: { accounts: true },
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
      where: {
        currency: data.currency,
        user: { id: user.id }, // Filter by the user's ID
      },
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
      user: user, // Assign the user object to the 'user' property
    });

    //save budget entity in DB
    return await this.repository.save(budget);
  }

  async updateOne(id: number, data: UpdateBudgetDto) {
    const currentBudget = await this.repository.findOne({
      where: { id },
    });
    if (!currentBudget) {
      throw new NotFoundException('No budget found with the provided id.');
    }

    // check if data is already created
    const existingBudget = await this.repository.findOne({
      where: {
        id: Not(id), // Exclude the currentBudget ID from the results
        currency: data.currency,
        user: { id: data.userId }, // Filter by the user's ID
      },
    });
    if (existingBudget) {
      throw new ConflictException(
        `You already have a budget with ${data.currency} currency.`,
      );
    }

    // Update the properties of the currentBudget entity
    currentBudget.name = data.name;
    currentBudget.currency = data.currency;
    // Save the updated budget entity in the database
    await this.repository.save(currentBudget);
    return currentBudget;
  }

  async deleteOne(id: number) {
    return super.deleteOne(id);
  }
}
