export interface transactionType {
  payee: string;
  user_id?: string;
  _id?: string;
  outflow: string | number;
  date: string;
  categoryId: string;
  budgetId: string;
  categoryTitle: string;
  budgetItemTitle: string;
  inflow: string | number;
  createdAt?: string;
  updatedAt?: string;
}
