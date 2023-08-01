import { CategoryResponseDto } from '../category/dto';
import { Category } from '../category/entities';

export const createCategoryResponseDto = (
  category: Category,
): CategoryResponseDto => {
  return {
    id: category.id,
    title: category.title,
    balance: category.balance,
    budgeted: category.budgeted,
    outflows: category.outflows,
    subCategories: category.subCategories,
  };
};
