import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GoalService } from '../../services/goal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  goal: any = null;
  loading = true;

  userName = localStorage.getItem('userName') || "User";

  constructor(
    private router: Router,
    private goalService: GoalService
  ) {}

  ngOnInit() {
    this.goalService.getGoal().subscribe({
      next: (data: any) => {
        console.log("GOAL FROM BACKEND:", data);
        this.goal = data || null;
        this.loading = false;
      },
      error: (err) => {
        console.log("GOAL ERROR:", err);
        this.goal = null;
        this.loading = false;
      }
    });
  }

  get progress() {
    if (!this.goal) return 0;
    return (this.goal.currentAmount / this.goal.targetAmount) * 100;
  }

  get monthlyRequired() {
    if (!this.goal?.deadline || !this.goal?.targetAmount) return 0;

    const today = new Date();
    const deadline = new Date(this.goal.deadline);

    if (isNaN(deadline.getTime())) return 0;

    const months =
      (deadline.getFullYear() - today.getFullYear()) * 12 +
      (deadline.getMonth() - today.getMonth());

    const safeMonths = Math.max(months, 1);

    const remaining = this.goal.targetAmount - this.goal.currentAmount;

    return Math.ceil(remaining / safeMonths);
  }

  goToCreateGoal() {
    this.router.navigate(['/goal/step1']);
  }

  deleteGoal() {
  if (!this.goal?._id) return;

  const confirmed = confirm("Are you sure you want to delete this goal?");
  if (!confirmed) return;

  this.goalService.deleteGoal(this.goal._id).subscribe({
    next: () => {
      this.goal = null;
    },
    error: (err) => console.error("Delete error:", err)
  });
}

}
