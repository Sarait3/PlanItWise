import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GoalWizardService } from '../../../services/goal-wizard.service';
import { GoalService } from '../../../services/goal.service';
import { AuthService } from '../../../services/auth.service';

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
        private wizard: GoalWizardService,
        private goalService: GoalService,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.data = this.wizard.getData();

        const targetAmount = this.data.targetAmount;
        const monthlyIncome = this.data.monthlyIncome;
        const monthlyExpenses = this.data.monthlyExpenses;

        const targetDate = new Date(this.data.targetDate);
        const today = new Date();

        let monthsRemaining =
            (targetDate.getFullYear() - today.getFullYear()) * 12 +
            (targetDate.getMonth() - today.getMonth());

        // Adjust for day of the month 
        if (targetDate.getDate() < today.getDate()) {
            monthsRemaining -= 1;
        }

        monthsRemaining = Math.max(monthsRemaining, 1);

        this.monthlyRequired = Math.ceil(targetAmount / monthsRemaining);

        this.monthlyAvailable = monthlyIncome - monthlyExpenses;

        this.goalIsAchievable = this.monthlyAvailable >= this.monthlyRequired;
    }

    private getMonthDifference(start: Date, end: Date): number {
        let months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        // If the end day is earlier in the month than the start day, subtract 1
        if (end.getDate() < start.getDate()) {
            months -= 1;
        }

        return months;
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

        const payload = {
            user: userId,
            title: this.data.goalName,
            description: this.data.category || "",
            targetAmount: this.data.targetAmount,
            deadline: new Date(this.data.targetDate),
            currentAmount: 0,
            status: "active"
        };

        console.log("📤 Sending payload:", payload);

        this.goalService.createGoal(payload).subscribe({
            next: () => {
                console.log("Goal created!");
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                console.error("Backend error:", err.error || err);
            }
        });
    }
}
