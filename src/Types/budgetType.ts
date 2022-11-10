import { accountType } from './accountType';

export interface budgetType {
  currency: string;
  available: number;
  _id?: string;
  accounts: accountType[];
  user_id?: string;
  _doc: any;
  updatedAt?: string; //isostring
  createdAt?: string; //isostring
}
