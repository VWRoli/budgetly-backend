import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSubCategoryDto,
  SubCategoryResponseDto,
  UpdateSubCategoryDto,
} from '../dto';
import { SubCategory } from '../entities';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../category/entities';
import { createSubCategoryResponseDto } from '../sub-category.helpers';
import { CategoryService } from '../../category/service';
import { Budget } from '../../budget/entities';
import { BudgetService } from '../../budget/service';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private repository: Repository<SubCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    private readonly categoryService: CategoryService,
    private readonly budgetService: BudgetService,
  ) {}

  async getAll(categoryId: number): Promise<SubCategoryResponseDto[]> {
    const subCategories = await this.repository.find({
      where: { category: { id: categoryId } },
      select: ['id', 'title', 'budgeted', 'outflows', 'balance'],
    });

    //format response
    const responseSubCategories: SubCategoryResponseDto[] = subCategories.map(
      (subCategory) => createSubCategoryResponseDto(subCategory),
    );

    return responseSubCategories;
  }
  async createOne(data: CreateSubCategoryDto): Promise<SubCategoryResponseDto> {
    //check if category exists
    const category = await this.categoryRepository.findOne({
      where: {
        id: data.categoryId,
      },
    });
    if (!category) {
      throw new NotFoundException(`No category with the provided id`);
    }
    // check if data is already created
    const existingSubCategory = await this.repository.findOne({
      where: {
        title: data.title,
        category: { id: category.id }, // Filter by the category's ID
      },
    });
    if (existingSubCategory) {
      throw new ConflictException(
        `You already have a sub category with the same name`,
      );
    }
    // Create a new instance of the SubCategory entity
    const subCategory = this.repository.create({
      title: data.title,
      balance: 0,
      budgeted: 0,
      outflows: 0,
      category: category, // Assign the category object to the 'category' property
    });
    // Save the SubCategory entity in the DB
    const savedSubCategory = await this.repository.save(subCategory);

    //format response
    return createSubCategoryResponseDto(savedSubCategory);
  }

  async updateOne(
    id: number,
    data: UpdateSubCategoryDto,
  ): Promise<SubCategoryResponseDto> {
    const currentSubCategory = await this.repository.findOne({
      where: { id },
    });
    if (!currentSubCategory) {
      throw new NotFoundException('No SubCategory found with the provided id.');
    }

    const category = await this.categoryRepository.findOne({
      where: {
        id: data.categoryId,
      },
    });

    const budget = await this.budgetRepository.findOne({
      where: {
        id: category.budgetId,
      },
    });
    // check if data is already created
    const existingSubCategory = await this.repository.findOne({
      where: {
        id: Not(id), // Exclude the currentSubCategory ID from the results
        title: data.title,
        category: { id: data.categoryId }, // Filter by the category's ID
      },
    });
    if (existingSubCategory) {
      throw new ConflictException(
        `You already have a SubCategory with the same name.`,
      );
    }

    // Update the properties of the currentSubCategory entity
    if (data.title) {
      currentSubCategory.title = data.title;
    }
    if (data.balance) {
      currentSubCategory.balance = data.balance;
    }
    if (data.outflows) {
      currentSubCategory.outflows = data.outflows;
    }
    if (data.budgeted) {
      currentSubCategory.budgeted = data.budgeted;
      //update ADD amount to category budgeted value
      await this.categoryService.updateOne(category.id, {
        ...category,
        budgeted: category.budgeted + data.budgeted,
      });
      //update extract amount from available to budget
      await this.budgetService.updateOne(budget.id, {
        ...budget,
        availableToBudget: budget.availableToBudget - data.budgeted,
      });
    }

    // Save the updated SubCategory entity in the database
    await this.repository.save(currentSubCategory);

    //format response
    return createSubCategoryResponseDto(currentSubCategory);
  }

  async deleteOne(id: number) {
    try {
      const currentSubCategory = await this.repository.findOne({
        where: { id },
      });

      if (!currentSubCategory) {
        throw new NotFoundException(
          'No sub category found with the provided id.',
        );
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
