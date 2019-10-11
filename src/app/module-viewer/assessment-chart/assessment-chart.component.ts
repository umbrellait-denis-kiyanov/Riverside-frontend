import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'assessment-chart',
  templateUrl: './assessment-chart.component.html',
  styleUrls: ['./assessment-chart.component.sass']
})
export class AssessmentChartComponent implements OnInit {

  @Input() series: any;

  @Input() colors: string[];

  @Input() isLineChart: boolean;

  @Output() activatedSeriesChange = new EventEmitter();

  xAxisTickFormatting: (idx: number) => string;

  xTicks = [];
  yTicks = [];

  labels = {};
  fullLabels = {};

  colorScheme = {
    domain: (this.colors && this.colors.length ? this.colors : ['#58ad3f']).concat(['#999'])
  };

  barCustomColors = [];

  seriesIndex = [];

  constructor() { }

  ngOnInit() {
    const maxLen = 20;
    this.series[0].series.forEach((group, idx) => {
      this.labels[idx + 1] = group.label.length <= maxLen ? group.label : group.label.substr(0, maxLen - 2) + '...';
      this.fullLabels[idx + 1] = group.label;

      delete group.label;

      this.barCustomColors.push({name: (idx + 1).toString(), value: group.value < 0 ? '#ff6666' : '#a9da9a'});

      this.xTicks = Array.from(Array(this.series[0].series.length + 2).keys()).map(k => k - 1);

      this.yTicks = Array.from(Array(11).keys()).map(k => (k * 10) - 50);
    });

    this.seriesIndex = this.series.map(series => series.name);

    this.series.push({name: '', series: [{value: 0, name: -10}, {value: 0, name: this.series[0].series.length + 10}]});

    if (this.series.length > 2) {
      this.colorScheme.domain = ['red', 'green', 'blue', '#00b862', '#afdf0a', '#a7b61a', '#f3e562', '#ff9800', '#ff5722', '#ff4514']
        .concat(this.colorScheme.domain).slice(-1 * this.series.length);
    }

    this.xAxisTickFormatting = (idx: number) => this.labels[idx] || '';
  }

  activate(event) {
    this.activatedSeriesChange.emit(this.seriesIndex.indexOf(event.value.name));
  }

  deactivate(event) {
    this.activatedSeriesChange.emit(null);
  }

}
