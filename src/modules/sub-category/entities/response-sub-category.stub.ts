import { SubCategoryResponseDto } from '../../sub-category/dto';

export const stubSubCategoryResponse = (): SubCategoryResponseDto => {
  return {
    id: 1,
    title: 'Test Category Item',
    budgeted: 1000,
    outflows: 500,
    balance: 500,
  };
};
