import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoalMathService {

  // Months remaining until deadline (minimum 1)
  getMonthsRemaining(today: Date, deadline: Date): number {
    let months =
      (deadline.getFullYear() - today.getFullYear()) * 12 +
      (deadline.getMonth() - today.getMonth());

    // Adjust for day-of-month
    if (deadline.getDate() < today.getDate()) {
      months -= 1;
    }

    return Math.max(months, 1);
  }

  /* Progress percentage (0–100+)
     UI helper only; backend is source of truth for stored values.
 */
  getProgress(currentAmount: number, targetAmount: number): number {
    const t = Number(targetAmount) || 0;
    if (t <= 0) return 0;

    const c = Number(currentAmount) || 0;
    return (c / t) * 100;
  }

  // Dollar amount required to reach a milestone percentage
  getMilestoneAmount(percent: number, targetAmount: number): number {
    return (Number(targetAmount) || 0) * ((Number(percent) || 0) / 100);
  }
}