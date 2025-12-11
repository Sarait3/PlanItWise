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
    selector: 'app-dashboard-contribution-summary',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contribution-summary.component.html'
})
export class ContributionSummaryComponent implements AfterViewInit, OnChanges {

    @Input() contributions: any[] = [];
    @Input() targetAmount = 0;
    @Input() currentAmount = 0;
    @Input() monthlyRequired = 0;
    @Input() startDate: string = '';
    @Input() goalCreatedAt: string = '';

    @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

    chart: Chart | null = null;
    viewReady = false;

    monthsActive = 0;
    scheduleStatus = '';
    catchUpAmount: number | null = null;

    isAhead = false;
    isBehind = false;
    isOnTrack = false;

    ngAfterViewInit() {
        this.viewReady = true;
        this.updateSummary();
        this.buildChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.viewReady) return;

        if (changes['contributions'] || changes['currentAmount']) {
            this.updateSummary();
            this.buildChart();
        }
    }

    private updateSummary() {
        this.monthsActive = this.computeMonthsActive(this.contributions);
        this.computeScheduleStatus();
    }

    private computeMonthsActive(contributions: any[]): number {
        const active = new Set<string>();

        contributions.forEach(c => {
            if (!c?.date) return;
            const d = new Date(c.date);
            active.add(`${d.getFullYear()}-${d.getMonth()}`);
        });

        return active.size;
    }

    private computeScheduleStatus() {
        const start = new Date(this.startDate || this.goalCreatedAt || new Date());
        const now = new Date();

        const monthsPassed =
            (now.getFullYear() - start.getFullYear()) * 12 +
            (now.getMonth() - start.getMonth()) + 1;

        const expectedSoFar = this.monthlyRequired * monthsPassed;
        const diff = this.currentAmount - expectedSoFar;

        this.isAhead = false;
        this.isBehind = false;
        this.isOnTrack = false;

        if (diff > this.monthlyRequired * 0.1) {
            this.scheduleStatus = "You're ahead of schedule 🎉";
            this.isAhead = true;
            this.catchUpAmount = null;
            return;
        }

        if (Math.abs(diff) <= this.monthlyRequired * 0.1) {
            this.scheduleStatus = "You're on track 👍";
            this.isOnTrack = true;
            this.catchUpAmount = null;
            return;
        }

        this.scheduleStatus = "You're behind schedule ⚠️";
        this.isBehind = true;
        this.catchUpAmount = Math.abs(diff);
    }

    private buildChart() {
        if (!this.barCanvas) return;
        if (!this.contributions.length) return;

        // Extract all contribution dates
        const dates = this.contributions
            .map(c => new Date(c.date))
            .filter(d => !isNaN(d.getTime()));

        if (!dates.length) return;

        // Find earliest and latest month using timestamps
        const start = new Date(Math.min(...dates.map(d => d.getTime())));
        const end = new Date(Math.max(...dates.map(d => d.getTime())));

        // Normalize both to the 1st day of the month
        start.setDate(1);
        end.setDate(1);

        // Build continuous month list
        const monthLabels: string[] = [];
        const monthlyTotals: number[] = [];
        const monthMap: Record<string, number> = {};

        const cursor = new Date(start);

        while (cursor <= end) {
            const label = cursor.toLocaleString('default', { month: 'short', year: '2-digit' });
            monthLabels.push(label);
            monthMap[label] = 0;

            cursor.setMonth(cursor.getMonth() + 1);
        }

        // Sum contributions per month
        this.contributions.forEach(c => {
            if (!c?.date) return;

            const d = new Date(c.date);
            if (isNaN(d.getTime())) return;

            const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (monthMap[label] !== undefined) {
                monthMap[label] += Number(c.amount);
            }
        });

        // Fill dataset in month order
        monthLabels.forEach(label => monthlyTotals.push(monthMap[label]));

        // Draw chart
        const ctx = this.barCanvas.nativeElement.getContext('2d');
        if (!ctx) return;

        if (this.chart) this.chart.destroy();

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthLabels,
                datasets: [
                    {
                        label: 'Monthly Contributions',
                        data: monthlyTotals,
                        backgroundColor: '#4b9cd3'
                    }
                ]
            },
            options: {
                responsive: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }


}
