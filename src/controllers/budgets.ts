import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import Budget from '../models/Budget.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getBudgets = async (req: userInfoReq, res: Response) => {
  try {
    const budgets = await Budget.find({
      user_id: req.user._id,
    });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getBudget = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;
  try {
    const [category] = await Budget.find({ _id: id });

    if (!category)
      throw createHttpError(404, 'No budget with that id was found');

    res.status(200).json(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createBudget = async (req: userInfoReq, res: Response) => {
  try {
    const alreadyExistingBudgets = await Budget.find({ user_id: req.user._id });

    const exists = alreadyExistingBudgets.some(
      (b) => b.currency.toLowerCase() === req.body.currency.toLowerCase(),
    );

    if (exists)
      throw createHttpError(
        400,
        'You already have a budget with that currency',
      );

    const newBudget = new Budget({
      ...req.body,
      user_id: req.user._id,
    });

    if (!newBudget)
      throw createHttpError(400, 'There was a problem creating a new budget');

    await newBudget.save();

    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteBudget = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createHttpError(404, 'No budget with that id!');

    await Budget.findByIdAndRemove(id);

    res.status(200).json({ message: 'Budget deleted successfully!' });
  } catch (error) {
    res.status(400).send(error);
  }
};
