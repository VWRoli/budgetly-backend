import { SubCategoryResponseDto } from '../sub-category/dto';
import { SubCategory } from '../sub-category/entities';

export const createSubCategoryResponseDto = (
  subCat: SubCategory | SubCategoryResponseDto,
): SubCategoryResponseDto => {
  return {
    id: subCat.id,
    title: subCat.title,
    balance: subCat.balance,
    budgeted: subCat.budgeted,
    outflows: subCat.outflows,
  };
};
