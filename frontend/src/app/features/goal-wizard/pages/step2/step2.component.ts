import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GoalWizardService } from '../../services/goal-wizard.service';

@Component({
  selector: 'app-goal-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {

  targetAmount: number = 0;
  targetDate: string = '';

  constructor(
    private wizard: GoalWizardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const data = this.wizard.getData();

    this.targetAmount = Number(data.targetAmount) || 0;
    this.targetDate = data.targetDate ?? '';
  }

  next(): void {
    this.wizard.setStepData('targetAmount', Number(this.targetAmount) || 0);
    this.wizard.setStepData('targetDate', this.targetDate);

    this.router.navigate(['/goal/step3']);
  }

  back(): void {
    this.router.navigate(['/goal/step1']);
  }
}