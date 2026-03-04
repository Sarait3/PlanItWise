export interface SavingsPlan {
  _id: string;
  goal: string;
  frequency: string;
  amountPerPeriod: number;
  nextContributionDate: string;
  paused?: boolean;
}