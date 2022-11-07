import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import createHttpError from 'http-errors';
import BudgetItem from '../models/BudgetItem.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

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

export const editBudgetItem = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;
  try {
    const budgetItem = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      throw createHttpError(404, 'No transaction with that ID.');

    const updatedBudgetItem = await BudgetItem.findByIdAndUpdate(
      id,
      budgetItem,
      {
        new: true,
      },
    );

    //Update the category object
    //get category by id
    const [category] = await Category.find({ _id: req.body.categoryId });
    if (!category) throw createHttpError(400, 'Problem updating budget item');

    const newCategory = {
      ...category._doc,
      budgetItems: [
        ...category.budgetItems.filter((b: any) => b._id.toString() !== id),
        updatedBudgetItem,
      ],
    };

    await Category.findByIdAndUpdate(req.body.categoryId, newCategory, {
      new: true,
    });

    res.status(200).json(updatedBudgetItem);
  } catch (error) {
    res.status(400).send(error);
  }
};
