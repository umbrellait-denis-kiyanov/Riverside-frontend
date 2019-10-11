import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'assessment-chart',
  templateUrl: './assessment-chart.component.html',
  styleUrls: ['./assessment-chart.component.sass']
})
export class AssessmentChartComponent implements OnInit {

  @Input() series: any;

  @Input() isLineChart: boolean;

  xAxisTickFormatting: (idx: number) => string;

  xTicks = [];
  yTicks = [];

  labels = {};
  fullLabels = {};

  colorScheme = {
    domain: ['#58ad3f', '#999']
  };

  barCustomColors = [];

  constructor() { }

  ngOnInit() {
    console.log(this.series);

    const maxLen = 20;
    this.series[0].series.forEach((group, idx) => {
      console.log(group);
      this.labels[idx + 1] = group.label.length <= maxLen ? group.label : group.label.substr(0, maxLen - 2) + '...';
      this.fullLabels[idx + 1] = group.label;

      delete group.label;

      this.barCustomColors.push({name: (idx + 1).toString(), value: group.value < 0 ? '#ff6666' : '#a9da9a'});

      this.xTicks = Array.from(Array(this.series[0].series.length + 2).keys()).map(k => k - 1);

      this.yTicks = Array.from(Array(11).keys()).map(k => (k * 10) - 50);
    });

    this.series.push({name: '', series: [{value: 0, name: -10}, {value: 0, name: this.series[0].series.length + 10}]});

    this.xAxisTickFormatting = (idx: number) => this.labels[idx] || '';
  }

}
