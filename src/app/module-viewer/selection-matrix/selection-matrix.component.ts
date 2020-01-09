import { Component, OnInit, Input } from '@angular/core';
import { TemplateComponent } from '../riverside-step-template/templates/template-base.cass';

@Component({
  selector: 'app-selection-matrix',
  templateUrl: './selection-matrix.component.html',
  styleUrls: ['./selection-matrix.component.sass']
})
export class SelectionMatrixComponent implements OnInit {

  @Input()
  question: string;

  @Input()
  personas: string[];

  @Input()
  options: any[] = [];

  @Input()
  horizontal = false;

  @Input()
  inputIds: { personas: string[] };

  @Input()
  disabled: boolean;

  constructor(
    private template: TemplateComponent
  ) {}

  ngOnInit() {
    this.options = this.options.map(opt => opt.option || opt);
  }

  toggleSelection(personaIdx, option, $event) {
    if ($event.target.tagName === 'INPUT') {
      return;
    }

    const input = this.template.getInput(this.inputIds.personas[personaIdx]);

    const checked = input.selections$.value.includes(option);

    this.updateSelection(input, option, !checked);
  }

  updateTextInput(personaIdx, option, $event) {
    const checked = $event.srcElement.checked;
    const input = this.template.getInput(this.inputIds.personas[personaIdx]);

    this.updateSelection(input, option, checked);
  }

  updateSelection(input, option, checked) {
    let selections = input.selections$.value;

    if (checked) {
      selections.push(option);
    } else {
      selections = selections.filter(sel => sel !== option);
    }

    input.selections$.next(selections);
  }

  notEmpty(el: string) {
    return !!this.template.textContent(el);
  }
}
