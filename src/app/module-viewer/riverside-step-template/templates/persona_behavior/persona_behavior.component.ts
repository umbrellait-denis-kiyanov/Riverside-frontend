import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { PersonaBehaviorTemplateData } from './persona_behavior.interface';

@Component({
  selector: 'app-persona_behavior',
  templateUrl: './persona_behavior.component.html',
  styleUrls: ['./persona_behavior.component.sass'],
  preserveWhitespaces: true
})

export class PersonaBehaviorTemplateComponent extends TemplateComponent {
  inputIds = {
    fromPreviousStep: [
      {
        title: 'persona_1',
        name: 'persona_name_1',
        picture: 'persona_picture_1'
      },
      {
        title: 'persona_2',
        name: 'persona_name_2',
        picture: 'persona_picture_2'
      },
      {
        title: 'persona_3',
        name: 'persona_name_3',
        picture: 'persona_picture_3'
      },
      {
        title: 'persona_4',
        name: 'persona_name_4',
        picture: 'persona_picture_4'
      },
      {
        title: 'persona_5',
        name: 'persona_name_5',
        picture: 'persona_picture_5'
      },
      {
        title: 'persona_6',
        name: 'persona_name_6',
        picture: 'persona_picture_6'
      }
    ],
    personas: [
      'persona_behavior_1',
      'persona_behavior_2',
      'persona_behavior_3',
      'persona_behavior_4',
      'persona_behavior_5',
      'persona_behavior_6',
    ]

  };


  contentData: PersonaBehaviorTemplateData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Persona Behavior';
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as PersonaBehaviorTemplateData['template_params_json'];

    const defaultContent = { content: this.contentData.formatAsList ? this.defaultListContent : '<p></p>' };
    const sufix = this.contentData.input_sufix || '';
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach((id, i) => {
        if (typeof id === 'string') {
          id = id + '_' + sufix;
          this.inputIds[key][i] = id;
          this.inputs[id] = this.inputs[id] || {...defaultContent};
        } else {
          Object.values(id).forEach((id2: string) => {
            this.inputs[id2] = this.inputs[id2] || {...defaultContent};
          });
        }
      });
    });

  }

}
