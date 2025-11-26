import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoalWizardService {

  private data: any = {
    category: null,
    goalName: '',
    targetAmount: null,
    targetDate: null,
    monthlyIncome: null,
    monthlyExpenses: null,
    monthlySaveRequired: null,
    weeklySaveRequired: null
  };

  setStepData(step: string, value: any) {
    this.data[step] = value;
  }

  getData() {
    return this.data;
  }

  reset() {
    this.data = {};
  }
}
