import { Component, Input } from "@angular/core";
import { TemplateComponent } from "../riverside-step-template/templates/template-base.class";
import { BuyerPersona } from "../../common/interfaces/buyer-persona.interface";

@Component({
  selector: "app-selection-matrix",
  templateUrl: "./selection-matrix.component.html",
  styleUrls: ["./selection-matrix.component.sass"]
})
export class SelectionMatrixComponent {
  @Input()
  question: string;

  @Input()
  personas: BuyerPersona[];

  @Input()
  options: Array<{ option: string }>;

  @Input()
  horizontal = false;

  @Input()
  inputIds: { personas: string[] };

  @Input()
  disabled: boolean;

  constructor(private template: TemplateComponent) {}

  toggleSelection(personaIdx, option, $event) {
    if ($event.target.tagName === "INPUT") {
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
