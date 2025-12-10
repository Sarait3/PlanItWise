import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-goal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal.component.html'
})
export class DashboardGoalComponent {

  @Input() goal: any;
  @Input() progress = 0;
  @Input() monthlyRequired = 0;
  @Input() achievedMilestones: any[] = [];

  @Output() deleteGoalClicked = new EventEmitter<void>();
  @Output() editGoalClicked = new EventEmitter<void>();

  onDelete() {
    this.deleteGoalClicked.emit();
  }

  onEdit() {
    this.editGoalClicked.emit();
  }
}
