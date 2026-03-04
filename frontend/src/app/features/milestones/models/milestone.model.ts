export interface Milestone {
  _id: string;
  goal: string; 
  percentage: number;
  auto?: boolean;
  targetDate?: string | null;
  achieved: boolean;
  createdAt?: string;
  updatedAt?: string;
}