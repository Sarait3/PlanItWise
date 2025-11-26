import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalWizardService } from '../../../services/goal-wizard.service';

@Component({
  selector: 'app-goal-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step1.html'
})
export class Step1Component implements OnInit {
  category = '';
  goalName = '';

  constructor(
    private wizard: GoalWizardService,
    private router: Router
  ) {}

  ngOnInit() {
    const data = this.wizard.getData();

    this.category = data.category || '';
    this.goalName = data.goalName || '';
  }

  selectCategory(c: string) {
    this.category = c;
  }

  next() {
    this.wizard.setStepData('category', this.category);
    this.wizard.setStepData('goalName', this.goalName);
    this.router.navigate(['/goal/step2']);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
