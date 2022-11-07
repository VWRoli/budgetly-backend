import { Response } from 'express';
import createHttpError from 'http-errors';
import Category from '../models/Category.js';
import { userInfoReq } from '../Types/userInfoReq.js';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

export const getCategories = async (req: userInfoReq, res: Response) => {
  const { budgetId } = req.params;
  try {
    if (!budgetId) throw createHttpError(400, 'Budget ID must be provided');

    const categories = await Category.find({
      budgetId,
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createCategory = async (req: userInfoReq, res: Response) => {
  const newCategory = new Category({
    ...req.body,
    userId: req.user._id,
  });

  if (!newCategory)
    throw createHttpError(400, 'There was a problem creating a new category');

  try {
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteCategory = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createHttpError(404, 'No category with that ID.');

    await Category.findByIdAndRemove(id);
    res.json({ message: 'Category deleted successfully!' });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const editCategory = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;
  try {
    const category = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createHttpError(404, 'No category with that ID.');

    const updatedCategory = await Category.findByIdAndUpdate(id, category, {
      new: true,
    });

    //update transactions when category title changes
    await Transaction.updateMany(
      { categoryId: id },
      { categoryTitle: req.body.title },
    );

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).send(error);
  }
};
