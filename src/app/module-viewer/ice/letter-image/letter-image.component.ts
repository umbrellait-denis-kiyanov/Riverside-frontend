import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'letter-image',
  templateUrl: './letter-image.component.html',
  styleUrls: ['./letter-image.component.sass']
})
export class LetterImageComponent implements OnInit {
  @Input() letter: string;
  @Input() className: string;

  constructor() { }

  ngOnInit() {
  }

}
