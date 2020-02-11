import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-assessment-score',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass']
})
export class AssessmentScoreComponent implements OnInit {
  @Input()
  score: number;

  constructor() {}

  ngOnInit() {}
}
