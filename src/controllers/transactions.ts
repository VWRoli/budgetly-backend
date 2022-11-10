import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import Transaction from '../models/Transaction.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { transactionType } from '../Types/transactionType.js';
import { handleInflow, handleOutflow } from './helpers.js';

export const getTransactions = async (req: userInfoReq, res: Response) => {
  const { accountId } = req.params;
  const id = req.user?._id;
  try {
    if (!id) throw createHttpError(400, 'This user has no transactions yet');

    if (accountId) {
      const transactions = await Transaction.find({
        accountId,
      });
      res.status(200).json(transactions);
    } else {
      const transactions = await Transaction.find({
        user_id: id,
      });
      res.status(200).json(transactions);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createTransaction = async (req: userInfoReq, res: Response) => {
  const newTransaction = new Transaction({
    ...req.body,
    user_id: req.user?._id,
  });

  const budgetItemId: string = req.body.budgetItemId;
  const budgetId: string = req.body.budgetId;
  const outflow: number = +req.body.outflow;
  const inflow: number = +req.body.inflow;

  try {
    if (req.body.inflow && req.body.outflow)
      throw createHttpError(
        400,
        'You can only have an inflow OR an outflow in your transacion.',
      );

    if (!newTransaction)
      throw createHttpError(
        400,
        'There was a problem creating a new transaction',
      );
    await newTransaction.save();

    //handle outflow
    if (outflow) handleOutflow(budgetItemId, outflow);

    //handle inflow
    if (inflow) handleInflow(inflow, budgetId, budgetItemId);

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteTransaction = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createHttpError(404, 'No transaction with that ID.');

    await Transaction.findByIdAndRemove(id);
    res.status(200).json({ message: 'Transaction deleted successfully!' });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const editTransaction = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;
  try {
    const transaction: transactionType = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createHttpError(404, 'No transaction with that ID.');

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      transaction,
      {
        new: true,
      },
    );

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).send(error);
  }
};
