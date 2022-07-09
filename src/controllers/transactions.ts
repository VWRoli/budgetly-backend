import { Response } from 'express';
import mongoose from 'mongoose';
import { userInfoReq } from '../Types/userInfoReq.js';
import Transaction from '../models/Transaction';

export const getTransactions = async (req: userInfoReq, res: Response) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user_id,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).send(error);
  }
};
