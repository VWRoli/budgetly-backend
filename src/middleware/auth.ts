import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { userInfoReq } from '../Types/userInfoReq';

const auth = async (req: userInfoReq, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) throw new Error('No authentication token was provided');

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findOne({
      _id: decoded.id,
      'tokens.token': token,
    });

    if (!user) throw createHttpError(400, 'Invalid user ID');

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: 'Please authenticate' });
  }
};

export default auth;
