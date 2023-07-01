import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities';
import { Not, Repository } from 'typeorm';
import { Budget } from '../../budget/entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  async getAll(budgetId: number) {
    return await this.repository.find({
      where: { budget: { id: budgetId } },
      relations: { subCategorys: true },
    });
  }
  async createOne(data: CreateCategoryDto) {
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
    const existingCategory = await this.repository.findOne({
      where: {
        title: data.title,
        budget: { id: budget.id }, // Filter by the budget's ID
      },
    });
    if (existingCategory) {
      throw new ConflictException(
        `You already have a category with the same name`,
      );
    }

    // Create a new instance of the Category entity
    const category = this.repository.create({
      title: data.title,
      balance: 0,
      budgeted: 0,
      outflows: 0,
      budget: budget, // Assign the budget object to the 'budget' property
    });

    // Save the category entity in the DB
    return await this.repository.save(category);
  }

  async updateOne(id: number, data: UpdateCategoryDto) {
    const currentCategory = await this.repository.findOne({
      where: { id },
    });
    if (!currentCategory) {
      throw new NotFoundException('No Category found with the provided id.');
    }

    // check if data is already created
    const existingCategory = await this.repository.findOne({
      where: {
        id: Not(id), // Exclude the currentCategory ID from the results
        title: data.title,
        budget: { id: data.budgetId }, // Filter by the budget's ID
      },
    });
    if (existingCategory) {
      throw new ConflictException(
        `You already have a category with the same name.`,
      );
    }

    // Update the properties of the currentCategory entity
    currentCategory.title = data.title;

    // Save the updated Category entity in the database
    await this.repository.save(currentCategory);
    return currentCategory;
  }

  async deleteOne(id: number) {
    try {
      const currentCategory = await this.repository.findOne({
        where: { id },
        relations: { subCategorys: true },
      });
      if (!currentCategory) {
        throw new NotFoundException('No category found with the provided id.');
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
