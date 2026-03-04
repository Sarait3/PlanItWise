import { Injectable } from '@angular/core';
import { GoalWizardData } from '../models/goal-wizard.model';

@Injectable({ providedIn: 'root' })
export class GoalWizardService {

  // Wizard state (data collected across steps)
  private data: GoalWizardData = {
    category: null,
    goalName: '',
    targetAmount: null,
    targetDate: null,
    monthlyIncome: null,
    monthlyExpenses: null
  };

  // Edit mode state
  editMode = false;
  goalIdToEdit: string | null = null;

  // Preload goal values when editing an existing goal
  preloadGoalForEditing(goal: any): void {
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

  // Save one field (step) into wizard state
  setStepData<K extends keyof GoalWizardData>(key: K, value: GoalWizardData[K]): void {
    this.data[key] = value;
  }

  // Get full wizard state
  getData(): GoalWizardData {
    return this.data;
  }

  // Reset wizard state
  reset(): void {
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