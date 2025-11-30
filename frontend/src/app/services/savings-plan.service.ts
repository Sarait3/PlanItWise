import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavingsPlanService {

  // -- Calculate remaining months 
  getMonthsRemaining(today: Date, deadline: Date): number {
    let months =
      (deadline.getFullYear() - today.getFullYear()) * 12 +
      (deadline.getMonth() - today.getMonth());

    // Adjust for days
    if (deadline.getDate() < today.getDate()) {
      months -= 1;
    }

    return Math.max(months, 1);
  }

  // Monthly required contribution
  getMonthlyRequired(targetAmount: number, currentAmount: number, deadline: Date): number {
    const today = new Date();
    const monthsRemaining = this.getMonthsRemaining(today, deadline);

    const remaining = Math.max(targetAmount - currentAmount, 0);
    return Math.ceil(remaining / monthsRemaining);
  }

  // Progress % calculation
  getProgress(currentAmount: number, targetAmount: number): number {
    if (!targetAmount) return 0;
    return (currentAmount / targetAmount) * 100;
  }

  // Sum all contributions
  sumContributions(contributions: any[]): number {
    if (!Array.isArray(contributions)) return 0;
    return contributions.reduce((sum, c) => sum + c.amount, 0);
  }

  // Milestone threshold
  getMilestoneAmount(percent: number, targetAmount: number): number {
    return targetAmount * (percent / 100);
  }

  // Determine which milestones are achieved
  evaluateMilestones(progress: number, milestones: any[]) {
    return milestones.map(m => ({
      ...m,
      achieved: progress >= m.percentage
    }));
  }

  // Default milestone percentages
  getDefaultMilestones(): number[] {
    return [25, 50, 75];
  }
}
