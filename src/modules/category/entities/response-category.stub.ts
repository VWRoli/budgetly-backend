import { stubSubCategoryResponse } from '../../sub-category/entities';
import { CategoryResponseDto } from '../../category/dto';

export const stubCategoryResponse = (): CategoryResponseDto => {
  return {
    id: 1,
    title: 'Test Category',
    budgeted: 1000,
    outflows: 500,
    balance: 500,
    subCategories: [],
  };
};
