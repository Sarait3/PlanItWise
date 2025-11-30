import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-goal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal.component.html'
})
export class DashboardGoalComponent {

  /* Goal info */
  @Input() goal: any;

  /* Goal progress */
  @Input() progress = 0;

  /* Required monthly amount */
  @Input() monthlyRequired = 0;

  /* Achieved milestones */
  @Input() achievedMilestones: any[] = [];

  /* Delete goal event */
  @Output() deleteGoalClicked = new EventEmitter<void>();

  /* Trigger delete */
  onDelete() {
    this.deleteGoalClicked.emit();
  }
}
