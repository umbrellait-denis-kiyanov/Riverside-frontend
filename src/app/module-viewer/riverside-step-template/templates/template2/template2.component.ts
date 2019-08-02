import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { Template2Data } from './template2.interface';

@Component({
  selector: 'app-template2',
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.sass']
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

  // contentData = data;

  protected init() {
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id] = this.inputs[id] || '';
      });
    });
    this.contentData = this.data.data.template_params_json as Template2Data['template_params_json'];
  }
}
