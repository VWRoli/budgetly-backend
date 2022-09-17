import { Response } from 'express';
import createHttpError from 'http-errors';
import Category from '../models/Category.js';
import { userInfoReq } from '../Types/userInfoReq.js';
import mongoose from 'mongoose';

export const getCategories = async (req: userInfoReq, res: Response) => {
  //todo?
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
  //todo
};
