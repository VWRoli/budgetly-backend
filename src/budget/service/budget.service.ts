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

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private repository: Repository<Budget>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createOne(data: CreateBudgetDto) {
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
}
