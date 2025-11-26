import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalWizardService } from '../../../services/goal-wizard.service';

@Component({
  selector: 'app-goal-step3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3.html'
})
export class Step3Component implements OnInit {

  monthlyIncome!: number;
  monthlyExpenses!: number;

  constructor(
    private wizard: GoalWizardService,
    private router: Router
  ) {}

  ngOnInit() {
    const data = this.wizard.getData();

    this.monthlyIncome = data.monthlyIncome ?? '';
    this.monthlyExpenses = data.monthlyExpenses ?? '';
  }

  next() {
    this.wizard.setStepData('monthlyIncome', this.monthlyIncome);
    this.wizard.setStepData('monthlyExpenses', this.monthlyExpenses);
    this.router.navigate(['/goal/step4']);
  }

  back() {
    this.router.navigate(['/goal/step2']);
  }
}
