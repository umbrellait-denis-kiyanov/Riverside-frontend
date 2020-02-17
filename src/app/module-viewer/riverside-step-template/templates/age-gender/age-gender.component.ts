import { Component, OnInit, forwardRef } from '@angular/core';
import { PersonaInputs } from '../persona-ids.class';
import { TemplateComponent } from '../template-base.class';
import { AgeGenderTemplateData } from '.';
import txt from '!!raw-loader!./index.ts';

@Component({
  selector: 'app-age-gender',
  templateUrl: './age-gender.component.html',
  styleUrls: ['./age-gender.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => AgeGenderComponent) }]
})
export class AgeGenderComponent extends TemplateComponent implements OnInit {
  inputIds: PersonaInputs;
  contentData: AgeGenderTemplateData['template_params_json'];
  params = txt;
  traits = [
    {
      id: 'age',
      title: 'Age'
    },
    {
      id: 'perc_male',
      title: '% Male',
      numeric: true
    },
    {
      id: 'perc_female',
      title: '% Female',
      numeric: true
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

  protected init() {
    this.contentData = this.data.data.template_params_json as AgeGenderTemplateData['template_params_json'];
    this.initIds();
  }

  initIds() {
    this.inputIds = new PersonaInputs({
      buyerPersonasList$: this.buyerPersonasList$,
      previousSteps: {
        title: {
          prefix: 'persona'
        },
        ...this.traitInputs()
      }
    });
  }

  traitInputs() {
    return this.traits.reduce((traitInputs, trait) => traitInputs[trait.id] = { prefix: 'persona_' + trait.id }, {});
  }
}
