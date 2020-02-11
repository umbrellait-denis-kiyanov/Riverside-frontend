import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-progress-bar',
  templateUrl: './dashboard-progress-bar.component.html',
  styleUrls: ['./dashboard-progress-bar.component.sass']
})
export class DashboardProgressBarComponent implements OnInit {
  @Input()
  progress: number;

  @Input()
  hasColors = false;

  constructor() {}

  ngOnInit() {}
}
