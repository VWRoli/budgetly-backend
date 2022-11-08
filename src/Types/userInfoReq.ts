import { Request } from 'express';
import { userType } from './userType';
export interface userInfoReq extends Request {
  user_id?: string;
  user?: userType;
}
