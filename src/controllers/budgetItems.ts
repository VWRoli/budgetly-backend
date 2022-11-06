import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import createHttpError from 'http-errors';
import BudgetItem from '../models/BudgetItem.js';
import Category from '../models/Category.js';

export const createBudgetItem = async (req: userInfoReq, res: Response) => {
  try {
    const newBudgetItem = new BudgetItem({
      ...req.body,
      user_id: req.user._id,
    });
    const categoryId = req.body.categoryId;
    if (!newBudgetItem)
      throw createHttpError(400, `Problem creating budget item`);

    await newBudgetItem.save();

    //Add it to the category object
    //get category by id
    const [category] = await Category.find({ _id: categoryId });

    if (!category) throw createHttpError(400, 'Problem creating budget item');
    //update category
    const newCategory = {
      ...category._doc,
      budgetItems: [...category.budgetItems, newBudgetItem],
    };
    await Category.findByIdAndUpdate(categoryId, newCategory, {
      new: true,
    });

    res.status(201).json(newBudgetItem);
  } catch (error) {
    res.status(400).send(error);
  }
};
