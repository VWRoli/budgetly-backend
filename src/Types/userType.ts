export interface userType {
  _id: string;
  username: string;
  email: string;
  password: string;
  balance: number;
  budgeted: number;
  available: number;
  defaultBudget: string;
  tokens: string[];
  generateAuthToken: () => void;
}
