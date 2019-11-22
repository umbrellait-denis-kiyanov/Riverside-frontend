import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { Template2Data } from './template2.interface';

@Component({
  selector: 'app-template2',
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => Template2Component) }]
})
export class Template2Component extends TemplateComponent {
  inputIds = {
    fromPreviousStep: ['brainstorm_personas'],
    personas: [
      'persona_1',
      'persona_2',
      'persona_3',
      'persona_4',
      'persona_5',
      'persona_6',
    ]
  };

  contentData: Template2Data['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Tpl2';
  }

  protected init() {
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        if (this.inputs[id]) {
          this.inputs[id].content = (this.inputs[id] || {content: ''}).content || '';
        }
      });
    });
    this.contentData = this.data.data.template_params_json as Template2Data['template_params_json'];
  }
}
