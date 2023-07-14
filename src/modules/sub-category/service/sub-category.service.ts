import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../dto';
import { SubCategory } from '../entities';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../category/entities';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private repository: Repository<SubCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(categoryId: number) {
    return await this.repository.find({
      where: { category: { id: categoryId } },
    });
  }
  async createOne(data: CreateSubCategoryDto) {
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
    // Create a new instance of the Category Item entity
    const subCategory = this.repository.create({
      title: data.title,
      balance: 0,
      budgeted: 0,
      outflows: 0,
      category: category, // Assign the category object to the 'category' property
    });
    // Save the category Item entity in the DB
    return await this.repository.save(subCategory);
  }

  async updateOne(id: number, data: UpdateSubCategoryDto) {
    const currentSubCategory = await this.repository.findOne({
      where: { id },
    });
    if (!currentSubCategory) {
      throw new NotFoundException(
        'No Category Item found with the provided id.',
      );
    }

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
        `You already have a category Item with the same name.`,
      );
    }

    // Update the properties of the currentSubCategory entity
    currentSubCategory.title = data.title;
    currentSubCategory.balance = data.balance;

    // Save the updated SubCategory entity in the database
    await this.repository.save(currentSubCategory);
    return currentSubCategory;
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
