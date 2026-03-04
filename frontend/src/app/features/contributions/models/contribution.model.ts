export interface Contribution {
  _id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}