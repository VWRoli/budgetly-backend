export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  balance: number;
  budgeted: number;
  available: number;
  accounts: string[]; //todo
  defaultBudget: string;
}