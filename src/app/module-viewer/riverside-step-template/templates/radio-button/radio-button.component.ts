import {Component, forwardRef, OnInit} from '@angular/core';
import {TemplateComponent} from '../template-base.class';
import txt from '!!raw-loader!./index.ts';
import {RadiobuttonTemplateData , Item} from '.';
import {TemplateInput} from '../../../../common/interfaces/module.interface';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => RadioButtonComponent) }]
})
export class RadioButtonComponent extends TemplateComponent {

  items: Item[];
  prefix = 'radio_button_1_';
  params = txt;
  contentData: RadiobuttonTemplateData['template_params_json'];
  userChoice = 0;
  input: TemplateInput;

  getDescription() {
    return 'Radio button';
  }

  getName() {
    return 'Radio button';
  }

  hasInputs(): boolean {
    return true;
  }

  validate(): boolean {
    return this.userChoice && this.contentData.require_selection;
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as RadiobuttonTemplateData['template_params_json'];
    this.items = this.contentData.options;
    this.input = this.getRadioInput();
    if ( this.input ) {
      this.userChoice = Number(this.input.getValue());
    }
  }

  onRadioChange() {
    this.input.content = String(this.userChoice);
    this.contentChanged(this.input);
  }

  getRadioInput(): TemplateInput {
    return this.getInput(this.contentData.input_sufix , null , this.prefix);
  }

}
