import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalWizardService } from '../../../services/goal-wizard.service';
import { UserService } from '../../../services/user.service';

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
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
  if (this.wizard.editMode) {
    this.userService.getUser().subscribe(user => {
      this.monthlyIncome = user.monthlyIncome;
      this.monthlyExpenses = user.monthlyExpenses;
    });
    return;
  }

  const data = this.wizard.getData();
  this.monthlyIncome = data.monthlyIncome ?? 0;
  this.monthlyExpenses = data.monthlyExpenses ?? 0;
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
