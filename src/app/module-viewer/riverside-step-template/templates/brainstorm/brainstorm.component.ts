import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.class';
import { BrainstormTemplateData } from '.';
import txt from '!!raw-loader!./index.ts';

@Component({
  selector: 'app-brainstorm',
  templateUrl: './brainstorm.component.html',
  styleUrls: ['./brainstorm.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => BrainstormTemplateComponent) }]
})
export class BrainstormTemplateComponent extends TemplateComponent {
  inputIds = ['brainstorm'];
  params = txt;

  contentData: BrainstormTemplateData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Brainstorm';
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as BrainstormTemplateData['template_params_json'];
  }
}
