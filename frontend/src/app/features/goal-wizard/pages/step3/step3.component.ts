import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GoalWizardService } from '../../services/goal-wizard.service';
import { UserService } from '../../../users/services/user.service';
import { User } from '../../../users/models/user.model';

@Component({
  selector: 'app-goal-step3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3.html'
})
export class Step3Component implements OnInit {

  monthlyIncome = 0;
  monthlyExpenses = 0;

  constructor(
    private wizard: GoalWizardService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Edit mode: preload finances from backend user profile
    if (this.wizard.editMode) {
      this.userService.getUser().subscribe({
        next: (user: User) => {
          this.monthlyIncome = user.monthlyIncome ?? 0;
          this.monthlyExpenses = user.monthlyExpenses ?? 0;
        },
        error: () => {
          // Fallback: use wizard data if API fails
          const data = this.wizard.getData();
          this.monthlyIncome = data.monthlyIncome ?? 0;
          this.monthlyExpenses = data.monthlyExpenses ?? 0;
        }
      });
      return;
    }

    // Create mode: preload from wizard data
    const data = this.wizard.getData();
    this.monthlyIncome = data.monthlyIncome ?? 0;
    this.monthlyExpenses = data.monthlyExpenses ?? 0;
  }

  next(): void {
    this.wizard.setStepData('monthlyIncome', Number(this.monthlyIncome) || 0);
    this.wizard.setStepData('monthlyExpenses', Number(this.monthlyExpenses) || 0);
    this.router.navigate(['/goal/step4']);
  }

  back(): void {
    this.router.navigate(['/goal/step2']);
  }
}