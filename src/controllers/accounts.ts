import { Response } from 'express';
import createHttpError from 'http-errors';
import Account from '../models/Account.js';
import Budget from '../models/Budget.js';
import { userInfoReq } from '../Types/userInfoReq.js';

export const createAccount = async (req: userInfoReq, res: Response) => {
  try {
    const newAccount = new Account({
      ...req.body,
      user_id: req.user?._id,
    });

    const budgetId: string = req.body.budgetId;
    if (!newAccount)
      throw createHttpError(400, 'There was a problem creating a new account');

    await newAccount.save();

    //Add it to the budget object
    //get budget by id
    const [budget] = await Budget.find({ _id: budgetId });

    if (!budget)
      throw createHttpError(
        400,
        `We couldn't find a budget with the provided ID`,
      );

    //update budget
    const newBudget = {
      ...budget._doc,
      accounts: [...budget.accounts, newAccount],
    };

    await Budget.findByIdAndUpdate(budgetId, newBudget, { new: true });

    res.status(201).json(newAccount);
  } catch (error) {
    res.status(400).send(error);
  }
};
//export const getAccount = async (req: userInfoReq, res: Response) => {};
