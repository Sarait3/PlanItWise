import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-contribution-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contribution-summary.component.html'
})
export class ContributionSummaryComponent {
  @Input() contributions: any[] = [];
  @Input() targetAmount = 0;
  @Input() currentAmount = 0;
  @Input() monthlyRequired = 0;
}
