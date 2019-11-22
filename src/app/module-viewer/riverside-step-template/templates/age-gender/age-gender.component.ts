import { Component, OnInit, forwardRef } from '@angular/core';
import { PersonaInputs } from '../persona-ids.class';
import { TemplateComponent } from '../template-base.cass';
import { AgeGenderTemplateData } from './age-gender.interface';

@Component({
  selector: 'app-age-gender',
  templateUrl: './age-gender.component.html',
  styleUrls: ['./age-gender.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => AgeGenderComponent) }]
})
export class AgeGenderComponent extends TemplateComponent implements OnInit {
  allIds: string[] = [];
  inputIds: PersonaInputs;
  contentData: AgeGenderTemplateData['template_params_json'];
  traits = [
    {
      id: 'age',
      title: 'Age'
    },
    {
      id: 'perc_male',
      title: '% Male',
    },
    {
      id: 'perc_female',
      title: '% Female',
    },
    {
      id: 'education',
      title: 'Typical education',
    }
  ];

  getDescription() {
    return '';
  }

  getName() {
    return 'Age & Gender';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as AgeGenderTemplateData['template_params_json'];
    this.initIds();
    ['fromPreviousSteps'].forEach(key => {
      this.inputIds[key].forEach((persona) => {
        Object.values(persona).forEach((id2: string) => {
          this.inputs[id2].content = this.inputs[id2].content || '';
          this.allIds.push(id2);
        });
      });
    });
  }

  initIds() {
    this.inputIds = new PersonaInputs({
      activePersonas: this.activePersonas,
      previousSteps: {
        title: {
          prefix: 'persona'
        },
        ...this.traitInputs()
      }
    });
  }

  traitInputs() {
    const traitInputs = {};
    this.traits.forEach(trait => {
      traitInputs[trait.id] = {
        prefix: 'persona_' + trait.id,
      };
    });
    return traitInputs;
  }

}
