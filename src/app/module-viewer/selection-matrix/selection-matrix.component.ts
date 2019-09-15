import { Component, OnInit, Input } from '@angular/core';
import { TemplateComponent } from '../riverside-step-template/templates/template-base.cass';

@Component({
  selector: 'app-selection-matrix',
  templateUrl: './selection-matrix.component.html',
  styleUrls: ['./selection-matrix.component.sass']
})
export class SelectionMatrixComponent  {

  @Input()
  question: string;

  @Input()
  personas: any;

  @Input()
  options: any[] = [];

  @Input()
  horizontal = false;

  @Input()
  inputs: any;

  @Input()
  inputIds: any;

  ngOnInit() {
    this.options = this.options.map(opt => opt.option || opt);
  }

  updateTextInput(personaIdx, option, $event) {
    const checked = $event.srcElement.checked;
    const input = this.inputs[this.inputIds.personas[personaIdx]];

    let selections = input.selections$.value;

    if (checked) {
      selections.push(option);
    } else {
      selections = selections.filter(sel => sel !== option);
    }

    input.selections$.next(selections);
  }

  notEmpty(el: string) {
    return !!this.textContent(el);
  }

  textContent(el: string) {
    const _el: any = window.$(el).clone();
    _el.find('.del').remove();
    return _el.length ? _el[0].textContent.replace(/\s/g, ' ') : '';
  }

}
