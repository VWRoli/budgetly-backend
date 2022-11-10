import createHttpError from 'http-errors';
import Budget from '../models/Budget.js';
import BudgetItem from '../models/BudgetItem.js';
import Category from '../models/Category.js';
import { budgetItemType } from '../Types/budgetItemType.js';
import { categoryType } from '../Types/categoryType.js';

export const handleOutflow = async (budgetItemId: string, outflow: number) => {
  //get budgetitem by id
  const [item] = await BudgetItem.find({ _id: budgetItemId });

  if (!item)
    throw createHttpError(404, 'The provided budget item ID was not found');

  //update item with amount
  const newItem: budgetItemType = {
    ...item._doc,
    balance: item.balance - outflow,
  };

  await BudgetItem.findByIdAndUpdate(budgetItemId, newItem, {
    new: true,
  });

  const categoryId: string = newItem.categoryId;
  //Update the category object
  //get category by id
  const [category] = await Category.find({ _id: categoryId });
  if (!category) throw createHttpError(400, 'Problem updating budget item');

  const newCategory: categoryType = {
    ...category._doc,
    balance: category.balance - outflow,
    budgetItems: [
      ...category.budgetItems.filter(
        (b: any) => b._id.toString() !== budgetItemId,
      ),
      newItem,
    ],
  };

  await Category.findByIdAndUpdate(categoryId, newCategory, {
    new: true,
  });
};

export const handleInflow = async (inflow: number, budgetItemId?: string) => {
  console.log({ budgetItemId });
  //if no budgetIteID present it will be an income for this month
  if (!budgetItemId) {
    //const [budget] = await Budget.find({_id: })
    return;
  }
  //get budgetitem by id
  const [item] = await BudgetItem.find({ _id: budgetItemId });

  if (!item)
    throw createHttpError(404, 'The provided budget item ID was not found');

  //update item with amount
  const newItem: budgetItemType = {
    ...item._doc,
    balance: item.balance + inflow,
  };

  await BudgetItem.findByIdAndUpdate(budgetItemId, newItem, {
    new: true,
  });

  const categoryId: string = newItem.categoryId;
  //Update the category object
  //get category by id
  const [category] = await Category.find({ _id: categoryId });
  if (!category) throw createHttpError(400, 'Problem updating budget item');

  const newCategory: categoryType = {
    ...category._doc,
    balance: category.balance + inflow,
    budgetItems: [
      ...category.budgetItems.filter(
        (b: any) => b._id.toString() !== budgetItemId,
      ),
      newItem,
    ],
  };

  await Category.findByIdAndUpdate(categoryId, newCategory, {
    new: true,
  });
};
