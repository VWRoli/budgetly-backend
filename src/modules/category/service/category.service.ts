import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

@Injectable()
export class CategoryService {
  async getAll(budgetId: number) {}
  async createOne(data: CreateCategoryDto) {}

  async updateOne(id: number, data: UpdateCategoryDto) {}

  async deleteOne(id: number) {}
}
