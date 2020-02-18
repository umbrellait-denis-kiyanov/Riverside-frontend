import { Component, OnInit, Input } from '@angular/core';
import { TemplateComponent } from '../templates/template-base.class';
import { BuyerPersona } from '../../../common/interfaces/buyer-persona.interface';

@Component({
  selector: 'riverside-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.sass']
})
export class PersonaComponent implements OnInit {
  @Input() persona: BuyerPersona;
  @Input() size: number = 80;

  style: {};

  constructor(private template: TemplateComponent) {}

  ngOnInit() {
    if (this.size) {
      this.style = {
        width: this.size + 'px',
        height: this.size + 'px'
      };
    }
  }
}
