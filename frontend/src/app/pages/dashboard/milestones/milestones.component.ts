import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-milestones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './milestones.component.html'
})
export class DashboardMilestonesComponent {

  /* Goal data */
  @Input() goal: any;

  /* List of milestones */
  @Input() milestones: any[] = [];

  /* Add milestone event */
  @Output() addMilestoneClicked =
    new EventEmitter<{ name: string; percentage: number }>();

  /* Delete milestone event */
  @Output() deleteMilestoneClicked = new EventEmitter<string>();

  /* New milestone input fields */
  newMilestoneName = '';
  newMilestonePercentage: number | null = null;

  /* Add milestone */
  onAdd() {
    if (!this.newMilestoneName || !this.newMilestonePercentage) return;

    this.addMilestoneClicked.emit({
      name: this.newMilestoneName,
      percentage: this.newMilestonePercentage
    });

    this.newMilestoneName = '';
    this.newMilestonePercentage = null;
  }

  /* Delete milestone */
  onDelete(id: string) {
    this.deleteMilestoneClicked.emit(id);
  }

  /* Calculate milestone amount */
  calcAmount(percent: number): number {
    return (percent / 100) * this.goal.targetAmount;
  }

}
