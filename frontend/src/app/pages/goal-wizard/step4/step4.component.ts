import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GoalWizardService } from '../../../services/goal-wizard.service';
import { GoalService } from '../../../services/goal.service';
import { AuthService } from '../../../services/auth.service';
import { SavingsPlanService } from '../../../services/savings-plan.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-goal-step4',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './step4.html'
})
export class Step4Component implements OnInit {

    data: any = {};
    monthlyRequired = 0;
    monthlyAvailable = 0;
    goalIsAchievable = false;

    constructor(
        public wizard: GoalWizardService,
        private goalService: GoalService,
        private auth: AuthService,
        private router: Router,
        private savings: SavingsPlanService,
        private userService: UserService
    ) { }



    ngOnInit(): void {
        this.data = this.wizard.getData();

        const targetAmount = this.data.targetAmount;
        const targetDate = new Date(this.data.targetDate);

        this.monthlyAvailable = this.data.monthlyIncome - this.data.monthlyExpenses;

        this.monthlyRequired = this.savings.getMonthlyRequired(
            targetAmount,
            0,
            targetDate
        );

        this.goalIsAchievable = this.monthlyAvailable >= this.monthlyRequired;
    }

    back() {
        this.router.navigate(['/goal/step3']);
    }

    createPlan() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("No userId found — user not logged in!");
            return;
        }

        const finances = {
            monthlyIncome: this.data.monthlyIncome,
            monthlyExpenses: this.data.monthlyExpenses
        };

        // Save user finances
        this.userService.updateFinances(finances).subscribe({
            next: () => {

                const payload = {
                    title: this.data.goalName,
                    description: this.data.category || "",
                    targetAmount: this.data.targetAmount,
                    deadline: new Date(this.data.targetDate)
                };

                // EDIT MODE: update goal
                if (this.wizard.editMode && this.wizard.goalIdToEdit) {
                    this.goalService.updateGoal(this.wizard.goalIdToEdit, payload).subscribe({
                        next: () => {
                            this.wizard.reset();
                            this.router.navigate(['/dashboard']);
                        },
                        error: err => console.error("Goal update error:", err)
                    });
                    return;
                }

                // CREATE MODE: create new goal
                const fullPayload = {
                    ...payload,
                    user: userId,
                    currentAmount: 0,
                    status: "active"
                };

                this.goalService.createGoal(fullPayload).subscribe({
                    next: () => {
                        this.wizard.reset();
                        this.router.navigate(['/dashboard']);
                    },
                    error: err => console.error("Goal creation error:", err)
                });
            },

            error: err => {
                console.error("Failed to save finances:", err);
            }
        });
    }

}
