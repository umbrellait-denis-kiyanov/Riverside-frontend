import { Component, OnInit, Input } from '@angular/core';
import { Input as TemplateInput } from 'src/app/common/interfaces/module.interface';
import { TemplateComponent } from '../riverside-step-template/templates/template-base.cass';

@Component({
  selector: '[inputText]',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.sass']
})
export class InputTextComponent implements OnInit {

  @Input() inputText: TemplateInput | string;
  @Input() num: number;

  text: string;

  constructor(private template: TemplateComponent) { }

  isInput(obj: any): obj is TemplateInput {
    return obj.content !== undefined;
  }

  ngOnInit() {
    const input = this.isInput(this.inputText) ? this.inputText : this.template.getInput(this.inputText, this.num);

    const div = document.createElement('div');
    div.innerHTML = input.content;
    this.text = div.textContent || div.innerText || '';
  }
}
