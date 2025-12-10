import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalWizardService } from '../../../services/goal-wizard.service';

@Component({
  selector: 'app-goal-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step2.html'
})
export class Step2Component implements OnInit {

  targetAmount!: number;
  targetDate!: string;

  constructor(
    private wizard: GoalWizardService,
    private router: Router
  ) { }

  ngOnInit() {
    const data = this.wizard.getData();

    this.targetAmount = data.targetAmount ?? '';
    this.targetDate = data.targetDate ?? '';
  }

  next() {
    this.wizard.setStepData('targetAmount', this.targetAmount);
    this.wizard.setStepData('targetDate', this.targetDate);

    this.router.navigate(['/goal/step3']);
  }


  back() {
    this.router.navigate(['/goal/step1']);
  }
}
