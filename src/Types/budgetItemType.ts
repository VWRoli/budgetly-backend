export interface budgetItemType {
  title: string;
  user_id?: number;
  _id?: number;
  categoryId: string;
  budgeted: number;
  outflow: number;
  balance: number;
}
