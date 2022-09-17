import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import Transaction from '../models/Transaction.js';
import createHttpError from 'http-errors';

export const getTransactions = async (req: userInfoReq, res: Response) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user_id, //todo not userId and not user_id fix it!
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

  if (!newTransaction)
    throw createHttpError(
      400,
      'There was a problem creating a new transaction',
    );

  try {
    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).send(error);
  }
};
