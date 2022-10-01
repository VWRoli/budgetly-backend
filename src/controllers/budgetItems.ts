import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import createHttpError from 'http-errors';
import BudgetItem from '../models/BudgetItem.js';

export const createBudgetItem = async (req: userInfoReq, res: Response) => {
  try {
    const newBudgetItem = new BudgetItem({
      ...req.body,
      user_id: req.user._id,
    });

    if (!newBudgetItem)
      throw createHttpError(400, `Problem creating budget item`);

    await newBudgetItem.save();

    res.status(201).json(newBudgetItem);
  } catch (error) {
    res.status(400).send(error);
  }
};
