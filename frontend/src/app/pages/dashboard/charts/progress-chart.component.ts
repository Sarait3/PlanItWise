import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart.component.html'
})
export class DashboardChartComponent implements AfterViewInit, OnChanges {

  /* Goal data */
  @Input() goal: any;

  /* Contribution list */
  @Input() contributions: any[] = [];

  /* Canvas reference */
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  viewReady = false;

  /* Initialize view */
  ngAfterViewInit() {
    this.viewReady = true;
    this.buildChart();
  }

  /* Update chart on input changes */
  ngOnChanges(changes: SimpleChanges) {
    if (this.viewReady && (changes['goal'] || changes['contributions'])) {
      this.buildChart();
    }
  }

  /* Build labels, timeline, and data values */
  private buildChart() {
    if (!this.goal || !this.chartCanvas?.nativeElement) return;

    const start = new Date(this.goal.startDate || this.goal.createdAt);
    const end = new Date(this.goal.deadline);

    const labels: string[] = [];
    const timeline: Date[] = [];

    let current = new Date(start);
    while (current <= end) {
      timeline.push(new Date(current));
      labels.push(current.toLocaleDateString());
      current.setMonth(current.getMonth() + 1);
    }

    const sortedContribs = [...this.contributions].sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let total = 0;
    let idx = 0;

    const values = timeline.map(datePoint => {
      while (
        idx < sortedContribs.length &&
        new Date(sortedContribs[idx].date) <= datePoint
      ) {
        total += sortedContribs[idx].amount;
        idx++;
      }
      return total;
    });

    this.renderChart(labels, values);
  }

  /* Render the chart */
  private renderChart(labels: string[], data: number[]) {
    if (this.chart) this.chart.destroy();

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 179, 156, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 179, 156, 0)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Savings Growth',
          data,
          borderColor: '#0bb39c',
          backgroundColor: gradient,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: (ctx: any) => {
            const index = ctx.dataIndex;
            const labelDate = labels[index];
            const match = this.contributions.some(
              (c: any) =>
                new Date(c.date).toLocaleDateString() === labelDate
            );
            return match ? 4 : 0;
          },
          pointHoverRadius: 6
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        layout: {
          padding: {
            top: 20,
            bottom: 10
          }
        },
        scales: {
          y: {
            min: 0,
            max: this.goal.targetAmount,
            ticks: {
              callback: (value: any) =>
                '$' + Number(value).toLocaleString()
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 30,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8
            }
          }
        }
      }
    });
  }
}
