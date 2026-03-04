import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { GoalService } from '../../../goals/services/goal.service';
import { MilestonesService } from '../../../milestones/services/milestones.service';
import { ContributionService } from '../../../contributions/services/contribution.service';
import { GoalWizardService } from '../../../goal-wizard/services/goal-wizard.service';

import { GoalMathService } from '../../../../shared/utils/goal-math.service';

import { DashboardChartComponent } from '../../components/charts/progress-chart.component';
import { DashboardGoalComponent } from '../../components/goal-summary/goal-summary.component';
import { DashboardContributionsComponent } from '../../components/add-contribution/add-contributions.component';
import { DashboardMilestonesComponent } from '../../components/milestones-panel/milestones-panel.component';
import { ContributionSummaryComponent } from '../../components/charts/contribution-summary.component';

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
  savingsPlan: any = null;

  loading = true;
  loadError: string | null = null;

  userName = localStorage.getItem('userName') || 'User';

  milestones: any[] = [];
  achievedMilestones: any[] = [];

  historyOpen = false;

  // separate messages so milestone popup doesn't get overwritten
  toastMsg: string | null = null;
  milestonePopup: string | null = null;

  private readonly DEFAULT_MILESTONES = [25, 50, 75];

  constructor(
    private router: Router,
    private goalService: GoalService,
    private milestoneService: MilestonesService,
    private contributionService: ContributionService,
    private goalMath: GoalMathService,
    private goalWizardService: GoalWizardService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private showToast(msg: string): void {
    this.toastMsg = msg;
    setTimeout(() => (this.toastMsg = null), 3000);
  }

  /* 
   * Dashboard Loader
   */
  loadDashboard(): void {
    this.loading = true;
    this.loadError = null;

    this.goalService.getGoal().subscribe({
      next: (data: any) => {
        this.goal = data || null;
        this.loading = false;

        if (!this.goal) {
          this.savingsPlan = null;
          this.milestones = [];
          this.achievedMilestones = [];
          return;
        }

        this.loadSavingsPlan();
        this.loadMilestonesAndEvaluate(false);
      },
      error: () => {
        this.goal = null;
        this.savingsPlan = null;
        this.milestones = [];
        this.achievedMilestones = [];
        this.loading = false;
        this.loadError = 'Unable to load dashboard right now.';
      }
    });
  }

  private loadSavingsPlan(): void {
    if (!this.goal?._id) return;

    this.goalService.getSavingPlan(this.goal._id).subscribe({
      next: (plan: any) => (this.savingsPlan = plan),
      error: () => (this.savingsPlan = null)
    });
  }

  /* 
   * Computed values
   */
  get progress(): number {
    if (!this.goal) return 0;
    // Always compute from current values so milestone checks are up-to-date
    // right after contribution create/delete responses.
    return this.goalMath.getProgress(this.goal.currentAmount, this.goal.targetAmount);
  }

  get monthlyRequired(): number {
    if (this.goal && typeof this.goal.monthlyRequired === 'number') {
      return this.goal.monthlyRequired;
    }
    return this.savingsPlan?.amountPerPeriod ?? 0;
  }

  /* 
   * Navigation
   */
  goToCreateGoal(): void {
    this.router.navigate(['/goal/step1']);
  }

  onEditGoal(): void {
    if (!this.goal) return;
    this.goalWizardService.preloadGoalForEditing(this.goal);
    this.router.navigate(['/goal/step1'], { queryParams: { edit: true } });
  }

  onDeleteGoal(): void {
    if (!this.goal?._id) return;
    if (!confirm('Delete this goal?')) return;

    this.goalService.deleteGoal(this.goal._id).subscribe({
      next: () => {
        this.goal = null;
        this.savingsPlan = null;
        this.milestones = [];
        this.achievedMilestones = [];
        this.showToast('Goal deleted 🗑️');
      }
    });
  }

  /* 
   * Milestones
   */
  private loadMilestonesAndEvaluate(showPopups = false): void {
    if (!this.goal?._id) return;

    this.milestoneService.getMilestonesByGoal(this.goal._id).subscribe({
      next: (res: any[]) => {
        this.milestones = (res || []).slice().sort((a: any, b: any) => a.percentage - b.percentage);
        this.achievedMilestones = this.milestones.filter(m => m.achieved);

        const created = this.ensureDefaultMilestones();
        if (!created) {
          this.checkMilestones(showPopups);
        }
      },
      error: () => {
        this.milestones = [];
        this.achievedMilestones = [];
      }
    });
  }

  private ensureDefaultMilestones(): boolean {
    if (!this.goal?._id) return false;

    const existing = new Set(this.milestones.map(m => m.percentage));
    const creates = this.DEFAULT_MILESTONES
      .filter(percent => !existing.has(percent))
      .map(percent => {
        const payload = {
          goal: this.goal._id,
          title: `${percent}% Milestone`,
          percentage: percent,
          auto: true,
          achieved: false
        };
        return this.milestoneService.createMilestone(payload);
      });

    if (creates.length) {
      forkJoin(creates).subscribe({
        next: () => this.loadMilestonesAndEvaluate(false),
        error: () => {}
      });
      return true;
    }

    return false;
  }

  onAddMilestone(event: { name: string; percentage: number }): void {
    const name = event.name?.trim();
    const percentage = Number(event.percentage);
    if (!name || percentage < 1 || percentage > 100) return;

    const payload = {
      goal: this.goal._id,
      title: name,
      percentage,
      auto: false,
      achieved: false
    };

    this.milestoneService.createMilestone(payload).subscribe(() => this.loadMilestonesAndEvaluate(false));
  }

  onDeleteMilestone(id: string): void {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    this.milestoneService.deleteMilestone(id).subscribe({
      next: () => {
        this.milestones = this.milestones.filter(m => m._id !== id);
        this.achievedMilestones = this.milestones.filter(m => m.achieved);
        this.showToast('Milestone deleted 🗑️');
      },
      error: err => console.error('Error deleting milestone:', err)
    });
  }

  calculateMilestoneAmount(percent: number, target: number): number {
    return this.goalMath.getMilestoneAmount(percent, target);
  }

  private checkMilestones(showPopups = false): void {
    if (!this.goal) return;

    const progress = this.progress;

    const prevAchieved = new Map<string, boolean>(
      this.milestones.map(m => [m._id, !!m.achieved])
    );

    const evaluated = this.milestones.map(m => ({
      ...m,
      achieved: progress >= m.percentage
    }));

    // If progress jumps over multiple milestones, show only the highest popup
    const newlyAchieved = evaluated
      .filter(m => (prevAchieved.get(m._id) ?? false) === false && m.achieved)
      .sort((a: any, b: any) => b.percentage - a.percentage);

    evaluated.forEach(m => {
      const was = prevAchieved.get(m._id) ?? false;
      if (!was && m.achieved) {
        this.milestoneService.achieveMilestone(m._id).subscribe();
      }
    });

    if (showPopups && newlyAchieved.length) {
      this.showMilestonePopup(newlyAchieved[0].percentage);
    }

    this.milestones = evaluated;
    this.achievedMilestones = evaluated.filter(m => m.achieved);
  }

  private showMilestonePopup(percent: number): void {
    this.milestonePopup = `Congratulations! You reached ${percent}% of your goal!`;
    setTimeout(() => (this.milestonePopup = null), 4500);
  }

  /*
   * Contributions
   */
  onAddContribution(event: { amount: number; date: string; note: string }): void {
    const amount = Number(event.amount);
    if (!this.goal?._id || amount <= 0) return;

    const payload = {
      goal: this.goal._id,
      amount,
      date: event.date,
      note: event.note
    };

    this.contributionService.createContribution(payload).subscribe({
      next: (res: any) => {
        // res should be: { contribution, goal, savingsPlan }
        if (res?.goal) this.goal = { ...this.goal, ...res.goal };
        if (res?.savingsPlan) this.savingsPlan = res.savingsPlan;

        if (res?.contribution) {
          this.goal.contributions = this.goal.contributions ?? [];
          this.goal.contributions = [...this.goal.contributions, res.contribution].sort(
            (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }

        this.showToast('Contribution added ✅');

        // Re-check milestones with popups now that progress changed
        this.checkMilestones(true);
      },
      error: err => {
        console.error('Create contribution error:', err);
        this.showToast('Failed to add contribution ❌');
      }
    });
  }

  deleteContribution(id: string): void {
    if (!confirm('Delete this contribution?')) return;

    this.contributionService.deleteContribution(id).subscribe({
      next: (res: any) => {
        // res should be: { msg, goal, savingsPlan }
        if (res?.goal) this.goal = { ...this.goal, ...res.goal };
        if (res?.savingsPlan) this.savingsPlan = res.savingsPlan;

        // Remove locally if present
        if (this.goal?.contributions?.length) {
          this.goal.contributions = this.goal.contributions.filter((c: any) => c._id !== id);
        }

        this.showToast('Contribution deleted 🗑️');

        this.checkMilestones(false);
      },
      error: err => {
        console.error('Delete contribution error:', err);
        this.showToast('Failed to delete contribution ❌');
      }
    });
  }

  toggleHistoryPanel(): void {
    this.historyOpen = !this.historyOpen;
  }
}
