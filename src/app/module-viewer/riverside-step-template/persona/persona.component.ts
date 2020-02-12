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

  name = '';
  title = '';
  picture = '';

  constructor(
    private template: TemplateComponent
  ) {}

  ngOnInit() {
    this.name = this.persona.name;
    this.picture = this.persona.picture;
    this.title = this.persona.title;

    if (this.size) {
      this.style = {
        width: this.size + 'px',
        height: this.size + 'px'
      };
    }
  }
}
