import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryItemDto, UpdateCategoryItemDto } from '../dto';
import { CategoryItem } from '../entities';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../category/entities';

@Injectable()
export class CategoryItemService {
  constructor(
    @InjectRepository(CategoryItem)
    private repository: Repository<CategoryItem>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(categoryId: number) {
    return await this.repository.find({
      where: { category: { id: categoryId } },
    });
  }
  async createOne(data: CreateCategoryItemDto) {
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
    const existingCategoryItem = await this.repository.findOne({
      where: {
        title: data.title,
        category: { id: category.id }, // Filter by the category's ID
      },
    });
    if (existingCategoryItem) {
      throw new ConflictException(
        `You already have a category item with the same name`,
      );
    }

    // Create a new instance of the Category Item entity
    const categoryItem = this.repository.create({
      title: data.title,
      balance: 0,
      budgeted: 0,
      outflows: 0,
      category: category, // Assign the category object to the 'category' property
    });

    // Save the category Item entity in the DB
    return await this.repository.save(categoryItem);
  }

  async updateOne(id: number, data: UpdateCategoryItemDto) {
    const currentCategoryItem = await this.repository.findOne({
      where: { id },
    });
    if (!currentCategoryItem) {
      throw new NotFoundException(
        'No Category Item found with the provided id.',
      );
    }

    // check if data is already created
    const existingCategoryItem = await this.repository.findOne({
      where: {
        id: Not(id), // Exclude the currentCategoryItem ID from the results
        title: data.title,
        category: { id: data.categoryId }, // Filter by the category's ID
      },
    });
    if (existingCategoryItem) {
      throw new ConflictException(
        `You already have a category Item with the same name.`,
      );
    }

    // Update the properties of the currentCategoryItem entity
    currentCategoryItem.title = data.title;

    // Save the updated CategoryItem entity in the database
    await this.repository.save(currentCategoryItem);
    return currentCategoryItem;
  }
  async deleteOne(id: number) {
    try {
      const currentCategoryItem = await this.repository.findOne({
        where: { id },
      });

      if (!currentCategoryItem) {
        throw new NotFoundException(
          'No category item found with the provided id.',
        );
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
