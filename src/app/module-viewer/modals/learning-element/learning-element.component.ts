import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Step } from 'src/app/common/interfaces/module.interface';

@Component({
  selector: 'app-learning-element',
  templateUrl: './learning-element.component.html',
  styleUrls: ['./learning-element.component.sass']
})
export class LearningElementComponent implements OnInit {
  @Input() element: Step['elements'][number];
  pdfUrl: string;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {
    this.pdfUrl = `https://docs.google.com/viewer?url=${this.element.data}&embedded=true`;
  }

}
