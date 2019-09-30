import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass']
})
export class AssessmentComponent implements OnInit {

  @Input()
  score: number;

  constructor() { }

  ngOnInit() {
  }

}
