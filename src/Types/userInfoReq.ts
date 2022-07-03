import { Request } from 'express';
export interface userInfoReq extends Request {
  userId: string;
}
