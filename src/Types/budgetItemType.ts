export interface budgetItemType {
  title: string;
  user_id?: number;
  _id?: number;
  categoryId: string;
  budgetId: string;
  budgeted: number;
  balance: number;
  _doc: any;
}
