import { Response } from 'express';
import { userInfoReq } from '../Types/userInfoReq.js';
import Account from '../models/Account.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getAccounts = async (req: userInfoReq, res: Response) => {
  try {
    const accounts = await Account.find({
      userId: req.user_id,
    });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createAccount = async (req: userInfoReq, res: Response) => {
  const newAccount = new Account({
    ...req.body,
    user_id: req.user._id,
  });

  if (!newAccount)
    throw createHttpError(400, 'There was a problem creating a new account');

  try {
    await newAccount.save();

    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteAccount = async (req: userInfoReq, res: Response) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw createHttpError(404, 'No account with that id!');

    await Account.findByIdAndRemove(id);

    res.json({ message: 'Account deleted successfully!' });
  } catch (error) {
    res.status(400).send(error);
  }
};
