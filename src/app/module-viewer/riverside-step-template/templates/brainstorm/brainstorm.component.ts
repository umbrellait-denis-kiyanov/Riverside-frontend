import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { BrainstormTemplateData } from '.';
import { of } from 'rxjs';
import { Validate } from 'src/app/common/validator.class';

@Component({
  selector: 'app-brainstorm',
  templateUrl: './brainstorm.component.html',
  styleUrls: ['./brainstorm.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => BrainstormTemplateComponent) }]
})
export class BrainstormTemplateComponent extends TemplateComponent {
  contentData: BrainstormTemplateData['template_params_json'];
  inputIds: string[];

  getDescription() {
    return '';
  }

  getName() {
    return 'Brainstorm';
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as BrainstormTemplateData['template_params_json'];

    this.inputIds = Object.keys(this.data.data.inputs).slice(0, Number(this.contentData.number_of_inputs));
  }

  validate() {
    const validator = [Validate.required('Please fill out this field')];

    return of(this.inputIds.reduce((isValid, input) => this.validateInput(this.getInput(input), validator) && isValid, true));
  }
}
