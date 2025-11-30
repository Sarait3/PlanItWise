import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GoalWizardService } from '../../../services/goal-wizard.service';
import { GoalService } from '../../../services/goal.service';
import { AuthService } from '../../../services/auth.service';
import { SavingsPlanService } from '../../../services/savings-plan.service';

@Component({
    selector: 'app-goal-step4',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './step4.html'
})
export class Step4Component implements OnInit {

    // Wizard data from previous steps
    data: any = {};

    // Calculated fields
    monthlyRequired = 0;
    monthlyAvailable = 0;
    goalIsAchievable = false;

    constructor(
        private wizard: GoalWizardService,
        private goalService: GoalService,
        private auth: AuthService,
        private router: Router,
        private savings: SavingsPlanService
    ) {}

    ngOnInit(): void {
        // Retrieve all data entered in previous wizard steps
        this.data = this.wizard.getData();

        const targetAmount = this.data.targetAmount;
        const targetDate = new Date(this.data.targetDate);

        // Calculate how much the user has available to save per month
        this.monthlyAvailable =
            this.data.monthlyIncome - this.data.monthlyExpenses;

        // Calculate required monthly savings
        this.monthlyRequired = this.savings.getMonthlyRequired(
            targetAmount,
            0,
            targetDate
        );

        // Compare required amount with what the user can actually save
        this.goalIsAchievable = this.monthlyAvailable >= this.monthlyRequired;
    }

    // Return to previous wizard step
    back() {
        this.router.navigate(['/goal/step3']);
    }

    // Create goal in database and navigate to dashboard
    createPlan() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("No userId found — user not logged in!");
            return;
        }

        // Prepare the payload for backend
        const payload = {
            user: userId,
            title: this.data.goalName,
            description: this.data.category || "",
            targetAmount: this.data.targetAmount,
            deadline: new Date(this.data.targetDate),
            currentAmount: 0,
            status: "active"
        };

        // Send goal to backend
        this.goalService.createGoal(payload).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err) => console.error("Backend error:", err.error || err)
        });
    }
}
