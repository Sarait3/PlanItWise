export interface Goal {
  _id: string;
  title: string;
  description?: string;
  targetAmount: number;
  deadline: string;
  createdAt?: string;
  updatedAt?: string;
}