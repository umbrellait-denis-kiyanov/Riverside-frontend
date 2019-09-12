import { Component, OnInit, Input } from '@angular/core';
import { TemplateComponent } from '../riverside-step-template/templates/template-base.cass';

@Component({
  selector: 'app-selection-matrix',
  templateUrl: './selection-matrix.component.html',
  styleUrls: ['./selection-matrix.component.sass']
})
export class SelectionMatrixComponent  {

  @Input()
  personas: any;

  @Input()
  options: string[] = [];

  @Input()
  horizontal = false;

  @Input()
  inputs: any;

  @Input()
  inputIds: any;

  ngOnInit() {
  }

  updateTextInput(personaIdx, option, $event) {
    const checked = $event.srcElement.checked;
    const input = this.inputs[this.inputIds.personas[personaIdx]];

    // if ('<p><br></p>' === input.content) {
    //   input.content = '<p><span></span></p>';
    // }

    const el: HTMLDivElement = document.createElement('div');
    el.innerHTML = input.content;

    if (checked) {
      const newEl = document.createElement('span');
      newEl.innerHTML = option;
      newEl.className = 'matrix-option';
      newEl.title = option;

      el.appendChild(newEl);
    } else {
      el.querySelectorAll('span[title="' + option + '"]').forEach(item => item.parentNode.removeChild(item));
    }

    input.content = el.innerHTML;

    console.log(input);
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
