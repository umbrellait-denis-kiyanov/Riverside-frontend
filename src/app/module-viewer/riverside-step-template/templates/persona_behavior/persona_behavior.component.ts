import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { PersonaBehaviorTemplateData } from './persona_behavior.interface';

@Component({
  selector: 'app-persona_behavior',
  templateUrl: './persona_behavior.component.html',
  styleUrls: ['./persona_behavior.component.sass']
})

export class PersonaBehaviorTemplateComponent extends TemplateComponent {
  inputIds = {
    fromPreviousStep: [
      {
        title: 'persona_1',
        name: 'persona_name_1'
      },
      {
        title: 'persona_2',
        name: 'persona_name_2'
      },
      {
        title: 'persona_3',
        name: 'persona_name_3'
      },
      {
        title: 'persona_4',
        name: 'persona_name_4'
      },
      {
        title: 'persona_5',
        name: 'persona_name_5'
      },
      {
        title: 'persona_6',
        name: 'persona_name_6'
      }
    ]

  };


  contentData: PersonaBehaviorTemplateData['template_params_json'];

  // contentData = data;

  protected init() {
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id] = this.inputs[id] || '';
      });
    });
    this.contentData = this.data.data.template_params_json as PersonaBehaviorTemplateData['template_params_json'];
  }

  private prepareIds() {

  }
}
