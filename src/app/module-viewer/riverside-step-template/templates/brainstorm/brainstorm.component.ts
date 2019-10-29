import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { BrainstormTemplateData } from './brainstorm.interface';

@Component({
  selector: 'app-brainstorm',
  templateUrl: './brainstorm.component.html',
  styleUrls: ['./brainstorm.component.sass']
})
export class BrainstormTemplateComponent extends TemplateComponent {
  inputIds = ['brainstorm'];

  contentData: BrainstormTemplateData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Brainstorm';
  }

  protected init() {
    this.inputIds.forEach(id => {
      this.inputs[id].content = this.inputs[id].content || '';
    });

    this.contentData = this.data.data.template_params_json as BrainstormTemplateData['template_params_json'];
  }
}
