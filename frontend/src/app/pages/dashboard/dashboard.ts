import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GoalService } from '../../services/goal.service';
import { MilestonesService } from '../../services/milestones.service';
import { ContributionService } from '../../services/contribution.service';
import { SavingsPlanService } from '../../services/savings-plan.service';
import { GoalWizardService } from '../../services/goal-wizard.service';

import { DashboardChartComponent } from './charts/progress-chart.component';
import { DashboardGoalComponent } from './goal/goal.component';
import { DashboardContributionsComponent } from './contributions/contributions.component';
import { DashboardMilestonesComponent } from './milestones/milestones.component';
import { ContributionSummaryComponent } from './charts/contribution-summary.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardChartComponent,
    DashboardGoalComponent,
    DashboardContributionsComponent,
    DashboardMilestonesComponent,
    ContributionSummaryComponent
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  goal: any = null;
  loading = true;
  userName = localStorage.getItem('userName') || 'User';

  milestones: any[] = [];
  achievedMilestones: any[] = [];

  historyOpen = false;
  milestonePopup: string | null = null;

  constructor(
    private router: Router,
    private goalService: GoalService,
    private milestoneService: MilestonesService,
    private contributionService: ContributionService,
    private savings: SavingsPlanService,
    private goalWizardService: GoalWizardService
  ) {}

  ngOnInit() {
    this.goalService.getGoal().subscribe({
      next: (data: any) => {
        this.goal = data || null;
        this.loading = false;

        if (this.goal) {
          if (!this.goal.contributions) this.goal.contributions = [];

          this.goal.currentAmount = this.savings.sumContributions(
            this.goal.contributions
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

  get progress(): number {
    if (!this.goal) return 0;
    return this.savings.getProgress(
      this.goal.currentAmount,
      this.goal.targetAmount
    );
  }

  get monthlyRequired(): number {
    if (!this.goal) return 0;
    return this.savings.getMonthlyRequired(
      this.goal.targetAmount,
      this.goal.currentAmount,
      new Date(this.goal.deadline)
    );
  }

  /* ---------- Navigation ---------- */

  goToCreateGoal() {
    this.router.navigate(['/goal/step1']);
  }

  onEditGoal() {
    this.goalWizardService.preloadGoalForEditing(this.goal);
    this.router.navigate(['/goal/step1'], { queryParams: { edit: true } });
  }

  onDeleteGoal() {
    if (!this.goal?._id) return;
    if (!confirm('Delete this goal?')) return;

    this.goalService.deleteGoal(this.goal._id).subscribe(() => {
      this.goal = null;
    });
  }

  /* ---------- Milestones ---------- */

  loadMilestones() {
    this.milestoneService.getMilestonesByGoal(this.goal._id)
      .subscribe(res => {
        this.milestones = res;
        this.achievedMilestones = res.filter((m: any) => m.achieved);
        this.ensureDefaultMilestones();
      });
  }

  // ✅ AUTO MILESTONES FIXED (subscribe added)
  ensureDefaultMilestones() {
    const defaults = this.savings.getDefaultMilestones();
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

        this.milestoneService.createMilestone(payload)
          .subscribe(() => this.loadMilestones());
      }
    });
  }

  onAddMilestone(event: { name: string; percentage: number }) {
    if (!event.name || !event.percentage) return;

    const payload = {
      goal: this.goal._id,
      title: event.name,
      percentage: event.percentage,
      auto: false,
      achieved: false
    };

    this.milestoneService.createMilestone(payload)
      .subscribe(() => this.loadMilestones());
  }

  onDeleteMilestone(id: string) {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    this.milestoneService.deleteMilestone(id).subscribe({
      next: () => {
        this.milestones = this.milestones.filter(m => m._id !== id);
        this.achievedMilestones = this.milestones.filter(m => m.achieved);
      },
      error: err => console.error('Error deleting milestone:', err)
    });
  }

  resetMilestones() {
    this.milestones.forEach(m => m.achieved = false);
    this.achievedMilestones = [];
  }

  calculateMilestoneAmount(percent: number, target: number) {
    return this.savings.getMilestoneAmount(percent, target);
  }

  checkMilestones(showPopups = false) {
    const progress = this.progress;
    const evaluated = this.savings.evaluateMilestones(progress, this.milestones);

    evaluated.forEach((m, index) => {
      if (!this.milestones[index].achieved && m.achieved) {
        this.milestoneService.achieveMilestone(m._id).subscribe();
        if (showPopups) this.showMilestonePopup(m.percentage);
      }
    });

    this.milestones = evaluated;
    this.achievedMilestones = evaluated.filter(m => m.achieved);
  }

  showMilestonePopup(percent: number) {
    this.milestonePopup = `Congratulations! You reached ${percent}% of your goal!`;
    setTimeout(() => this.milestonePopup = null, 4500);
  }

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

        this.goal.contributions = [...this.goal.contributions, saved];
        this.goal.currentAmount = this.savings.sumContributions(
          this.goal.contributions
        );

        this.goal = { ...this.goal };
        this.checkMilestones(true);
      }
    });
  }

  deleteContribution(id: string) {
    if (!confirm('Delete this contribution?')) return;

    this.contributionService.deleteContribution(id).subscribe({
      next: () => {
        this.goal.contributions = this.goal.contributions.filter(
          (c: any) => c._id !== id
        );

        this.goal.currentAmount = this.savings.sumContributions(
          this.goal.contributions
        );

        this.goal = { ...this.goal };
        this.resetMilestones();
        this.checkMilestones(false);
      }
    });
  }

  toggleHistoryPanel() {
    this.historyOpen = !this.historyOpen;
  }
}
