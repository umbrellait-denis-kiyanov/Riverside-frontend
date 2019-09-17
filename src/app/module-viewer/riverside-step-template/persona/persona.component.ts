import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'riverside-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.sass']
})
export class PersonaComponent implements OnInit {
  @Input() name: string;
  @Input() title: string;
  @Input() picture: string;
  @Input() size: number = 80;

  style: {};

  constructor() { }

  ngOnInit() {
    if (this.size) {
      this.style = {
        width: this.size + 'px',
        height: this.size + 'px'
      };
    }
  }

}
