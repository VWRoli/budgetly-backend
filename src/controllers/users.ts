import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
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

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) throw createHttpError(400, 'Invalid credentials');
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) throw createHttpError(400, 'Invalid credentials');

    const token = await user.generateAuthToken();

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};
