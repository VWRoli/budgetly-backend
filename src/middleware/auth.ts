import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) throw new Error('No authentication token was provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log(decoded);
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
