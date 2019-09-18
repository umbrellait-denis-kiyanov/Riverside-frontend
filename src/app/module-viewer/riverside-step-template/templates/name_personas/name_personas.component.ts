import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { NamePersonasTemplateData } from './name_personas.interface';

@Component({
  selector: 'app-name_personas',
  templateUrl: './name_personas.component.html',
  styleUrls: ['./name_personas.component.sass']
})
export class NamePersonasTemplateComponent extends TemplateComponent {
  inputIds = {
    fromPreviousStep: [
      'persona_1',
      'persona_2',
      'persona_3',
      'persona_4',
      'persona_5',
      'persona_6',
    ],
    personas: [
      'persona_name_1',
      'persona_name_2',
      'persona_name_3',
      'persona_name_4',
      'persona_name_5',
      'persona_name_6',
    ]
  };

  contentData: NamePersonasTemplateData['template_params_json'];

  // contentData = data;

  getDescription() {
    return '';
  }

  getName() {
    return 'Name Personas';
  }

  protected init() {
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id] = this.inputs[id] || '';
      });
    });
    this.contentData = this.data.data.template_params_json as NamePersonasTemplateData['template_params_json'];
  }
}
