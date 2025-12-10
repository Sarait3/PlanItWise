import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoalWizardService {

  /** Wizard data container */
  private data: any = {
    category: null,
    goalName: '',
    targetAmount: null,
    targetDate: null,
    monthlyIncome: null,
    monthlyExpenses: null
  };

  /** EDIT MODE flags */
  editMode = false;
  goalIdToEdit: string | null = null;

  /** Preload existing goal into wizard for editing */
  preloadGoalForEditing(goal: any) {
    this.editMode = true;
    this.goalIdToEdit = goal._id;

    this.data = {
      category: goal.description || null,
      goalName: goal.title,
      targetAmount: goal.targetAmount,
      targetDate: goal.deadline?.split('T')[0] ?? null,
      monthlyIncome: null,
      monthlyExpenses: null
    };
  }

  /** Save step data */
  setStepData(step: string, value: any) {
    this.data[step] = value;
  }

  /** Retrieve wizard data */
  getData() {
    return this.data;
  }

  /** Reset wizard */
  reset() {
    this.editMode = false;
    this.goalIdToEdit = null;

    this.data = {
      category: null,
      goalName: '',
      targetAmount: null,
      targetDate: null,
      monthlyIncome: null,
      monthlyExpenses: null
    };
  }
}
