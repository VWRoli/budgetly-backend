import { Injectable } from '@nestjs/common';
import { CreateCategoryItemDto, UpdateCategoryItemDto } from '../dto';

@Injectable()
export class CategoryItemService {
  async getAll(categoryId: number) {}
  async createOne(data: CreateCategoryItemDto) {}

  async updateOne(id: number, data: UpdateCategoryItemDto) {}

  async deleteOne(id: number) {}
}
