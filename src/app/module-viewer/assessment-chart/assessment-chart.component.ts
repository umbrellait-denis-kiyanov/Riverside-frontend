import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssessmentChartSeries, AssessmentChartActiveEntries } from '.';

@Component({
  selector: 'assessment-chart',
  templateUrl: './assessment-chart.component.html',
  styleUrls: ['./assessment-chart.component.sass']
})
export class AssessmentChartComponent implements OnInit {
  @Input() series: AssessmentChartSeries;

  @Input() colors: string[];

  @Input() isLineChart: boolean;

  @Input() activeEntries: AssessmentChartActiveEntries;

  @Output() activatedSeriesChange: EventEmitter<number> = new EventEmitter();

  xAxisTickFormatting: (idx: number) => string;

  xTicks: number[];
  yTicks: number[];

  labels: { [key: number]: string } = {};
  fullLabels: { [key: number]: string } = {};

  colorScheme = {
    domain: ['#999', '#58ad3f']
  };

  barCustomColors: { name: string; value: string }[] = [];

  seriesIndex: string[];

  constructor() {}

  ngOnInit() {
    const maxLen = 20;

    this.series[0].series.forEach((group, idx) => {
      this.labels[idx + 1] =
        group.label.length <= maxLen
          ? group.label
          : group.label.substr(0, maxLen - 2) + '...';
      this.fullLabels[idx + 1] = group.label;

      delete group.label;

      this.barCustomColors.push({
        name: (idx + 1).toString(),
        value: group.value < 0 ? '#ff6666' : '#a9da9a'
      });

      this.xTicks = Array.from(
        Array(this.series[0].series.length + 2).keys()
      ).map(k => k - 1);

      this.yTicks = Array.from(Array(11).keys()).map(k => k * 10 - 50);
    });

    this.series.unshift({
      name: '',
      series: [
        { value: 0, name: -10 },
        { value: 0, name: this.series[0].series.length + 10 }
      ]
    });

    this.seriesIndex = this.series.map(series => series.name);

    if (this.colors) {
      this.colorScheme.domain = ['#999'].concat(this.colors);
    }

    this.colorScheme.domain = this.colorScheme.domain.slice(
      0,
      this.series.length
    );

    this.xAxisTickFormatting = (idx: number) => this.labels[idx] || '';

    if (!this.activeEntries) {
      this.activeEntries = [];
    }
  }

  activate(event) {
    this.activatedSeriesChange.emit(this.seriesIndex.indexOf(event.value.name));
  }

  deactivate(event) {
    this.activatedSeriesChange.emit(null);
  }
}
