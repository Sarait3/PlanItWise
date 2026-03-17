import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GoalWizardService } from '../../services/goal-wizard.service';
import { GoalService } from '../../../goals/services/goal.service';
import { UserService } from '../../../users/services/user.service';
import { GoalMathService } from '../../../../shared/utils/goal-math.service';

@Component({
  selector: 'app-goal-step4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step4.component.html'
})
export class Step4Component implements OnInit {

  data: any = {};
  monthlyRequired = 0;
  monthlyAvailable = 0;
  goalIsAchievable = false;

  constructor(
    public wizard: GoalWizardService,
    private goalService: GoalService,
    private router: Router,
    private goalMath: GoalMathService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.data = this.wizard.getData();

    const targetAmount = Number(this.data.targetAmount) || 0;
    const targetDate = new Date(this.data.targetDate);

    const income = Number(this.data.monthlyIncome) || 0;
    const expenses = Number(this.data.monthlyExpenses) || 0;

    this.monthlyAvailable = income - expenses;

    // UI-only estimate
    const monthsRemaining = this.goalMath.getMonthsRemaining(new Date(), targetDate);
    const remaining = Math.max(targetAmount - 0, 0);
    this.monthlyRequired = Math.ceil(remaining / monthsRemaining);

    this.goalIsAchievable = this.monthlyAvailable >= this.monthlyRequired;
  }

  back() {
    this.router.navigate(['/goal/step3']);
  }

  createPlan() {
    const finances = {
      monthlyIncome: Number(this.data.monthlyIncome) || 0,
      monthlyExpenses: Number(this.data.monthlyExpenses) || 0
    };

    // Save user finances
    this.userService.updateFinances(finances).subscribe({
      next: () => {
        const payload = {
          title: this.data.goalName,
          description: this.data.category || '',
          targetAmount: Number(this.data.targetAmount) || 0,

          deadline: new Date(this.data.targetDate).toISOString()
        };

        // EDIT MODE: update goal
        if (this.wizard.editMode && this.wizard.goalIdToEdit) {
          this.goalService.updateGoal(this.wizard.goalIdToEdit, payload).subscribe({
            next: () => {
              this.wizard.reset();
              this.router.navigate(['/dashboard']);
            },
            error: (err) => console.error('Goal update error:', err)
          });
          return;
        }

        // CREATE MODE: create new goal
        this.goalService.createGoal(payload).subscribe({
          next: () => {
            this.wizard.reset();
            this.router.navigate(['/dashboard']);
          },
          error: (err) => console.error('Goal creation error:', err)
        });
      },
      error: (err) => {
        console.error('Failed to save finances:', err);
      }
    });
  }
}