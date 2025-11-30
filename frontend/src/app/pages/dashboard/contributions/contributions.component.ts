import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-contributions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contributions.component.html'
})
export class DashboardContributionsComponent {

  /* Contribution form fields */
  amount: number | null = null;
  date: string = new Date().toISOString().substring(0, 10);
  note: string = '';

  /* Add contribution event */
  @Output() addContributionClicked =
    new EventEmitter<{ amount: number; date: string; note: string }>();

  /* Show history event */
  @Output() historyClicked = new EventEmitter<void>();

  /* Add a new contribution */
  onAdd() {
    if (!this.amount) return;

    this.addContributionClicked.emit({
      amount: this.amount,
      date: this.date,
      note: this.note
    });

    this.amount = null;
    this.note = '';
  }

  /* Open history panel */
  onHistory() {
    this.historyClicked.emit();
  }
}
