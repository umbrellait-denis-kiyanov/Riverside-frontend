import { Component, OnInit, Input } from '@angular/core';
import { TemplateComponent } from '../templates/template-base.class';

@Component({
  selector: 'riverside-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.sass']
})
export class PersonaComponent implements OnInit {
  @Input() persona: string;
  @Input() size: number = 80;

  style: {};

  name = '';
  title = '';
  picture = '';

  constructor(
    private template: TemplateComponent
  ) {}

  ngOnInit() {
    const idx = this.persona.split('_').pop();

    const input = this.template.getInput.bind(this.template);
    this.name = this.template.textContent(input('persona_name_' + idx).content);
    this.picture = input('persona_picture_' + idx).content;
    this.title = this.template.textContent(input(this.persona).content);

    if (this.size) {
      this.style = {
        width: this.size + 'px',
        height: this.size + 'px'
      };
    }
  }
}
