import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { Template3Data } from './template3.interface';

@Component({
  selector: 'app-template3',
  templateUrl: './template3.component.html',
  styleUrls: ['./template3.component.sass']
})
export class Template3Component extends TemplateComponent {
  inputIds = {
    fromPreviousStep: [
      'persona_1',
      'persona_2',
      'persona_3',
      'persona_4',
      'persona_5',
      'persona_6',
    ]
  };


  // contentData: Template3Data['template_params_json'];
  contentData = data;

  protected init() {
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id] = this.inputs[id] || '';
      });
    });
    // this.contentData = this.data.data.template_params_json;
  }
}
