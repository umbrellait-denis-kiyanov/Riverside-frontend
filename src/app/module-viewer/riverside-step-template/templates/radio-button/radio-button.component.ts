import {Component, forwardRef, OnInit} from '@angular/core';
import {TemplateComponent} from '../template-base.class';
import txt from '!!raw-loader!./index.ts';
import {RadiobuttonTemplateData} from '.';
import {Item} from '.';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => RadioButtonComponent) }]
})
export class RadioButtonComponent extends TemplateComponent {

  items: Item[];
  prefix = 'radio_button_';
  params = txt;
  contentData: RadiobuttonTemplateData['template_params_json'];
  userChoice = 0;

  getDescription() {
    return 'Radio button';
  }

  getName() {
    return 'Radio button';
  }

  hasInputs(): boolean {
    return true;
  }

  validateUserInput(): Observable<boolean> {
    return of(this.userChoice && this.contentData.require_selection);
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as RadiobuttonTemplateData['template_params_json'];
    this.items = this.contentData.options;
    this.userChoice = +this.inputs[`${this.prefix}1`].content;
  }

  onRadioChange() {
    const input = this.getInput(`1` , null , this.prefix);
    if ( input ) {
      input.content = JSON.stringify(this.userChoice);
      this.contentChanged(input);
    }
  }
}
