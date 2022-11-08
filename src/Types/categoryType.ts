import { budgetItemType } from './budgetItemType';

export interface categoryType {
  title: string;
  _id?: string;
  userId?: number;
  budgetItems: budgetItemType[];
  budgetId: string;
  budgeted?: number;
  available?: number;
  createdAt: string;
  updatedAt?: string;
  _doc?: any;
}
