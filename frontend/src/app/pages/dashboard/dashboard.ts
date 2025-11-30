import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GoalService } from '../../services/goal.service';
import { MilestonesService } from '../../services/milestones.service';
import { ContributionService } from '../../services/contribution.service';

// Dashboard child components
import { DashboardChartComponent } from './chart/chart.component';
import { DashboardGoalComponent } from './goal/goal.component';
import { DashboardContributionsComponent } from './contributions/contributions.component';
import { DashboardMilestonesComponent } from './milestones/milestones.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardChartComponent,
    DashboardGoalComponent,
    DashboardContributionsComponent,
    DashboardMilestonesComponent
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  // Goal and user state
  goal: any = null;
  loading = true;
  userName = localStorage.getItem('userName') || 'User';

  // Milestones state
  milestones: any[] = [];
  achievedMilestones: any[] = [];

  // UI state
  historyOpen = false;
  milestonePopup: string | null = null;

  constructor(
    private router: Router,
    private goalService: GoalService,
    private milestoneService: MilestonesService,
    private contributionService: ContributionService
  ) {}

  // Load goal on component initialization
  ngOnInit() {
    this.goalService.getGoal().subscribe({
      next: (data: any) => {
        this.goal = data || null;
        this.loading = false;

        if (this.goal) {
          if (!this.goal.contributions) this.goal.contributions = [];

          // Calculate current savings
          this.goal.currentAmount = this.goal.contributions.reduce(
            (sum: number, c: any) => sum + c.amount, 0
          );

          this.loadMilestones();
          setTimeout(() => this.checkMilestones(), 60);
        }
      },
      error: () => {
        this.goal = null;
        this.loading = false;
      }
    });
  }

  // Goal progress percentage
  get progress(): number {
    if (!this.goal || !this.goal.targetAmount) return 0;
    return (this.goal.currentAmount / this.goal.targetAmount) * 100;
  }

  // Monthly required contribution to reach deadline
  get monthlyRequired(): number {
    if (!this.goal?.deadline || !this.goal?.targetAmount) return 0;

    const today = new Date();
    const deadline = new Date(this.goal.deadline);

    const months =
      (deadline.getFullYear() - today.getFullYear()) * 12 +
      (deadline.getMonth() - today.getMonth());

    const safeMonths = Math.max(months, 1);
    const remaining = this.goal.targetAmount - this.goal.currentAmount;

    return Math.ceil(remaining / safeMonths);
  }

  // Navigate to goal creation wizard
  goToCreateGoal() {
    this.router.navigate(['/goal/step1']);
  }

  // Delete current goal and reset dashboard
  onDeleteGoal() {
    if (!this.goal?._id) return;
    if (!confirm('Delete this goal?')) return;

    this.goalService.deleteGoal(this.goal._id).subscribe(() => {
      this.goal = null;
    });
  }

  // Load all milestones associated with the goal
  loadMilestones() {
    this.milestoneService.getMilestonesByGoal(this.goal._id)
      .subscribe(res => {
        this.milestones = res;
        this.achievedMilestones = res.filter((m: any) => m.achieved);
        this.ensureDefaultMilestones();
      });
  }

  // Create default automatic milestones if missing (25%, 50%, 75%)
  ensureDefaultMilestones() {
    const defaults = [25, 50, 75];
    const existing = this.milestones.map(m => m.percentage);

    defaults.forEach(percent => {
      if (!existing.includes(percent)) {
        const payload = {
          goal: this.goal._id,
          title: `${percent}% Milestone`,
          percentage: percent,
          auto: true,
          achieved: false
        };

        this.milestoneService.createMilestone(payload).subscribe(() =>
          this.loadMilestones()
        );
      }
    });
  }

  // Add a custom milestone
  onAddMilestone(event: { name: string; percentage: number }) {
    if (!event.name || !event.percentage) return;

    const payload = {
      goal: this.goal._id,
      title: event.name,
      percentage: event.percentage,
      auto: false,
      achieved: false
    };

    this.milestoneService.createMilestone(payload).subscribe(() => {
      this.loadMilestones();
    });
  }

  // Delete a milestone
  onDeleteMilestone(id: string) {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    this.milestoneService.deleteMilestone(id).subscribe({
      next: () => {
        this.milestones = this.milestones.filter((m: any) => m._id !== id);
        this.achievedMilestones = this.milestones.filter((m: any) => m.achieved);
      },
      error: (err) => console.error("Error deleting milestone:", err)
    });
  }

  // Reset milestone achieved flags
  resetMilestones() {
    this.milestones.forEach(m => m.achieved = false);
    this.achievedMilestones = [];
  }

  // Calculate amount needed to reach a milestone percentage
  calculateMilestoneAmount(percent: number, target: number) {
    return target * (percent / 100);
  }

  // Check milestone completion based on progress
  checkMilestones(showPopups = false) {
    const progress = this.progress;

    this.milestones.forEach(m => {
      const percent = m.percentage;
      if (percent == null || isNaN(percent)) return;

      // Mark as achieved
      if (!m.achieved && progress >= percent) {
        m.achieved = true;

        if (!this.achievedMilestones.some((am: any) => am._id === m._id)) {
          this.achievedMilestones.push(m);
        }

        this.milestoneService.achieveMilestone(m._id).subscribe();

        if (showPopups) this.showMilestonePopup(percent);
      }

      // Mark as unachieved if progress decreases
      if (m.achieved && progress < percent) {
        m.achieved = false;
      }
    });

    this.achievedMilestones = this.milestones.filter(m => m.achieved);
  }

  // Display milestone achievement notification
  showMilestonePopup(percent: number) {
    this.milestonePopup = `Congratulations! You reached ${percent}% of your goal!`;
    setTimeout(() => this.milestonePopup = null, 4500);
  }

  // Add a new contribution and update dashboard state
  onAddContribution(event: { amount: number; date: string; note: string }) {
    if (!event.amount) return;

    const payload = {
      goal: this.goal._id,
      amount: event.amount,
      date: event.date,
      note: event.note
    };

    this.contributionService.createContribution(payload).subscribe({
      next: (saved: any) => {
        alert('Contribution added!');

        this.goal.currentAmount += saved.amount;
        this.goal.contributions.push(saved);

        // Trigger Angular change detection
        this.goal = {
          ...this.goal,
          contributions: [...this.goal.contributions]
        };

        this.checkMilestones(true);
      }
    });
  }

  // Delete a contribution and update totals
  deleteContribution(id: string) {
    if (!confirm('Delete this contribution?')) return;

    this.contributionService.deleteContribution(id).subscribe({
      next: () => {
        this.goal.contributions = this.goal.contributions.filter(
          (c: any) => c._id !== id
        );

        this.goal.currentAmount = this.goal.contributions.reduce(
          (sum: number, c: any) => sum + c.amount, 0
        );

        // Trigger Angular change detection
        this.goal = {
          ...this.goal,
          contributions: [...this.goal.contributions]
        };

        this.resetMilestones();
        this.checkMilestones(false);
      }
    });
  }

  // Toggle contribution history modal
  toggleHistoryPanel() {
    this.historyOpen = !this.historyOpen;
  }
}
