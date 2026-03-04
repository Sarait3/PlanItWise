export interface User {
  _id: string;
  name: string;
  email: string;

  monthlyIncome: number;
  monthlyExpenses: number;

  date: string;   // account creation date
}

export interface UpdateFinancesRequest {
  monthlyIncome: number;
  monthlyExpenses: number;
}