import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import User from '../models/User.js';
import { userInfoReq } from '../Types/userInfoReq.js';
import mongoose from 'mongoose';

export const createUser = async (req: Request, res: Response) => {
  const user = new User(req.body);
  try {
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) throw createHttpError(400, 'User already exists.');

    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
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

export const getProfile = async (req: userInfoReq, res: Response) => {
  res.send(req.user);
};

export const editProfile = async (req: userInfoReq, res: Response) => {
  const { _id } = req.user._id;
  try {
    const user = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createHttpError(404, 'No user with that ID.');

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) throw createHttpError(400, 'User already exists.');

    await User.findByIdAndUpdate({ _id }, user, {
      new: true,
    });
    res.status(200).json({ message: 'User profile updated successfully!' });
  } catch (error) {
    res.status(400).send(error);
  }
};
