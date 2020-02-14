import {Component, forwardRef, OnInit} from '@angular/core';
import {TemplateComponent} from '../template-base.class';
import {TemplateParams , RadiobuttonTemplateData} from '.';
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

  inputIds: {
    radioButtons: string[]
  };

  params = TemplateParams;

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
    console.log(this.getInput('userChoiceRadio'));
    // this.getInput()
    // this.inputIds = {
    //   radioButtons: this.items.map(item => persona.split('_').join('_behavior_') + suffix)
    // };
    console.log(this.inputs);
  }

  onRadioChange($event: MatRadioChange) {
    console.log($event);
    console.log(this.getInput('userChoiceRadio'));
  }
}
