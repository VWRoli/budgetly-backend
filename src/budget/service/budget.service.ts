import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from '../dto';
import { Budget } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { User } from 'src/auth/entities';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private repository: Repository<Budget>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(userId: string) {
    return await this.repository.find({
      where: { userId: new ObjectId(userId) },
    });
  }
  async createOne(data: CreateBudgetDto): Promise<Budget> {
    //check if user exists
    const user = await this.userRepository.findOne({
      where: {
        _id: new ObjectId(data.userId),
      },
    });

    if (!user) {
      throw new NotFoundException(`No user with the provided id`);
    }

    // check if data is already created
    const existingBudget = await this.repository.findOne({
      where: { userId: new ObjectId(data.userId), currency: data.currency },
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

    budget.user = user; // Assign the user relation
    budget.userId = new ObjectId(data.userId); // Assign the user relation

    //save budget entity in DB
    return await this.repository.save(budget);
  }

  async updateOne(id: string, data: UpdateBudgetDto): Promise<Budget> {
    const currentBudget = await this.repository.findOne({
      where: { _id: new ObjectId(id) },
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
        where: { _id: new ObjectId(id) },
      });
      //todo delete accounts and categories
      if (!currentBudget) {
        throw new NotFoundException('No budget found with the provided id.');
      }

      await this.repository.delete(new ObjectId(id));
    } catch (error) {
      throw error;
    }
  }
}
