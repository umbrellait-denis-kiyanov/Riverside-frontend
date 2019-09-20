import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'riverside-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.sass']
})
export class PersonaComponent implements OnInit {
  @Input() persona: string;
  @Input() inputs: [];
  @Input() size: number = 80;

  style: {};

  name = '';
  title = '';
  picture = '';

  constructor() { }

  ngOnInit() {
    const idx = this.persona.split('_').pop();

    this.name = this.textContent(this.inputs['persona_name_' + idx].content);
    this.picture = this.inputs['persona_picture_' + idx].content;
    this.title = this.textContent(this.inputs[this.persona].content);

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
