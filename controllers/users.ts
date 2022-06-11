import { Response, Request } from 'express';
import createHttpError from 'http-errors';
import User from '../models/User.js';

export const createUser = async (req: Request, res: Response) => {
  const user = new User(req.body);
  try {
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) throw createHttpError(400, 'User already exists.');

    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).send(error);
  }
};
