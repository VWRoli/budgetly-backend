export interface IResponseTransaction {
  id: number;
  payee: string;
  date: Date;
  inflow: number | null;
  outflow: number | null;
  budget: {
    id: number;
  };
  account: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    title: string;
  };
  subCategory: {
    id: number;
    title: string;
  };
}
