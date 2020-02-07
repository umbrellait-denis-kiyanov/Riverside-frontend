import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { PersonaStrategyTemplateData, TemplateParams } from '.';
import { BuyerPersona } from '../../../../common/interfaces/buyer-persona.interface';

@Component({
  selector: 'app-persona-strategy',
  templateUrl: './persona-strategy.component.html',
  styleUrls: ['./persona-strategy.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => PersonaStrategyComponent) }]
})
export class PersonaStrategyComponent extends TemplateComponent {
  params = TemplateParams;
  contentData: PersonaStrategyTemplateData['template_params_json'];

  prefix = 'persona_strategy_';
  inputState: number;
  buyerPersonasList$: BuyerPersona[];
  inputPrefixes = {
    '1_key_issues': {
      name: 'issues',
      count: []
    },
    '2_additional_questions': {
      name: 'questions',
      count: []
    },
    '3_message_flow': {
      name: 'message',
      count: []
    }
  };

  relevantMessaging = [
    {
      title: 'Inform',
      description: 'Loosen the Status Quo'
    },
    {
      title: 'Trigger',
      description: 'Commit to Change\n'
    },
    {
      title: 'Benefit',
      description: 'Explore Possible Solutions'
    },
    {
      title: 'Differentiate',
      description: 'Commit to a Solution'
    },
    {
      title: 'Business case',
      description: 'Justify the Decision'
    },
    {
      title: 'Confirm',
      description: 'Make the Selection\n'
    }
  ];

  protected init() {
    // @ts-ignore - template_params_json.inputs property causes error with TypeScript 3.1
    this.contentData = (this.data.data.template_params_json as PersonaStrategyTemplateData['template_params_json']);
    this.inputState = Number(this.contentData.step_type_select.substr(0, 1));
    this.initStates();

    this.buyerPersonasService.getBuyerPersonas()
        .pipe()
        .subscribe(el => this.buyerPersonasList$ = el);
  }

  initStates(): void {
    switch (this.inputState) {
      case 3:
        this.inputPrefixes['1_key_issues'].count = this.getPrefixCount(this.inputPrefixes['1_key_issues'].name);
        this.inputPrefixes['2_additional_questions'].count = this.getPrefixCount(this.inputPrefixes['2_additional_questions'].name);
        this.inputPrefixes['3_message_flow'].count = this.getPrefixCount(this.inputPrefixes['3_message_flow'].name);
        break;
      case 2:
        this.inputPrefixes['1_key_issues'].count = this.getPrefixCount(this.inputPrefixes['1_key_issues'].name);
        this.inputPrefixes['2_additional_questions'].count = this.getPrefixCount(this.inputPrefixes['2_additional_questions'].name);
        break;
      case 1:
        this.inputPrefixes['1_key_issues'].count = this.getPrefixCount(this.inputPrefixes['1_key_issues'].name);
        break;
    }
  }

  getPrefixCount(prefix: string): number[] {
    return this.makeIterable(+Object.keys(this.inputs).filter(el => el.includes(prefix)).slice(-1).pop().split('_').slice(-2).shift());
  }

  makeIterable(number: number): number[] {
    return Array.from(Array(number + 1).keys()).slice(1);
  }

  getDescription() {
    return 'Buyer Persona strategy';
  }

  getName() {
    return 'Persona Strategy';
  }

  hasInputs() {
    return true;
  }
}
