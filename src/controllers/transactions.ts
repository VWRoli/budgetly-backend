import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import Transaction from '../models/Transaction.js';
import createHttpError from 'http-errors';

export const getTransactions = async (req: userInfoReq, res: Response) => {
  const { budgetId } = req.params;
  try {
    if (!budgetId) throw createHttpError(400, 'Budget ID must be provided');

    const transactions = await Transaction.find({
      budgetId,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createTransaction = async (req: userInfoReq, res: Response) => {
  const newTransaction = new Transaction({
    ...req.body,
    user_id: req.user._id,
  });

  try {
    await newTransaction.save();
    if (req.body.income && req.body.outcome)
      throw createHttpError(
        400,
        'You can only have an income OR an outcome in your transacion.',
      );

    if (!newTransaction)
      throw createHttpError(
        400,
        'There was a problem creating a new transaction',
      );

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).send(error);
  }
};
