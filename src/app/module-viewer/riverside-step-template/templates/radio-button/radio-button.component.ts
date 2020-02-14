import {Component, forwardRef, OnInit} from '@angular/core';
import {TemplateComponent} from '../template-base.class';
import txt from '!!raw-loader!./index.ts';
import {RadiobuttonTemplateData} from '.';
import {Item} from './Item';
import {MatRadioChange} from '@angular/material';

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
  userChoice: Item;

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
    console.log(this.inputs);
    console.log(this.contentData);
  }

  onRadioChange($event: MatRadioChange) {
    const input = this.getInput(this.userChoice.id.toString() , null , this.prefix);
    input.content = JSON.stringify(this.userChoice);
  }

  approved() {
    const input = this.getInput(this.userChoice.id.toString() , null , this.prefix);
    input.content = JSON.stringify(this.userChoice);
    this.contentChanged(input);
  }
}
