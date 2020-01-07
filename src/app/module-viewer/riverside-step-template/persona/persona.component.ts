import { Component, OnInit, Input } from '@angular/core';
import { TemplateComponent } from '../templates/template-base.cass';

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
    this.name = this.textContent(input('persona_name_' + idx).content);
    this.picture = input('persona_picture_' + idx).content;
    this.title = this.textContent(input(this.persona).content);

    if (this.size) {
      this.style = {
        width: this.size + 'px',
        height: this.size + 'px'
      };
    }
  }

  textContent(el: string) {
    const _el: any = window.$(el).clone();
    _el.find('.del').remove();
    return _el.length ? _el[0].textContent.replace(/\s/g, ' ') : '';
  }

}
