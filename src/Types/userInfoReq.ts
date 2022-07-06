import { Request } from 'express';
export interface userInfoReq extends Request {
  user_id?: string;
  user?: any; //todo
}
