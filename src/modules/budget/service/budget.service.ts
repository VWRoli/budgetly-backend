import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BudgetResponseDto, CreateBudgetDto } from '../dto';
import { Budget } from '../entities';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBudgetDto } from '../dto';
import { User } from '../../auth/entities';
import { createBudgetResponseDto, setLoacle } from '../budget.helpers';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private repository: Repository<Budget>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(userId: number): Promise<BudgetResponseDto[]> {
    const budgets = await this.repository.find({
      where: { user: { id: userId } },
      select: ['id', 'name', 'locale', 'currency'],
    });

    //format response
    const responseBudgets: BudgetResponseDto[] = budgets.map((budget) =>
      createBudgetResponseDto(budget),
    );

    return responseBudgets;
  }

  async getOne(id: number): Promise<Budget> {
    const budget = await this.repository.findOne({
      where: { id },
      relations: { accounts: true },
    });

    if (!budget) {
      throw new NotFoundException(`No Budget with the provided id`);
    }
    return budget;
  }

  async createOne(data: CreateBudgetDto): Promise<BudgetResponseDto> {
    //check if user exists
    const user = await this.userRepository.findOne({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`No Budget with the provided id`);
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
      availableToBudget: 0,
      locale: setLoacle(data.currency),
      user: user, // Assign the user object to the 'user' property
    });

    //save budget entity in DB
    const savedBudget = await this.repository.save(budget);

    //set default budget
    await this.setDefault(user.id, savedBudget.id);

    //format response
    return createBudgetResponseDto(savedBudget);
  }

  async updateOne(
    id: number,
    data: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
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
    currentBudget.availableToBudget = data.availableToBudget;
    // Save the updated budget entity in the database
    await this.repository.save(currentBudget);

    //format response
    return createBudgetResponseDto(currentBudget);
  }

  async deleteOne(id: number) {
    try {
      const currentBudget = await this.repository.findOne({
        where: { id },
      });
      if (!currentBudget) {
        throw new NotFoundException('No budget found with the provided id.');
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async setDefault(userId: number, budgetId: number) {
    //check if user exists
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`No user with the provided id`);
    }

    const currentBudget = await this.repository.findOne({
      where: { id: budgetId },
    });
    if (!currentBudget) {
      throw new NotFoundException('No budget found with the provided id.');
    }

    const newUser: User = { ...user, defaultBudgetId: budgetId };

    await this.userRepository.save(newUser);
  }
}
