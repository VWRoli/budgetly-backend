import { transactionType } from './transactionType';

export interface accountType {
  balance: number;
  _id?: string;
  trasactions: transactionType[];
  updatedAt?: string; //isostring
  createdAt?: string; //isostring
}
