import { Component, forwardRef, OnDestroy } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { PersonaStrategyTemplateData, TemplateParams } from '.';
import { BuyerPersona } from '../../../../common/interfaces/buyer-persona.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-persona-strategy',
  templateUrl: './persona-strategy.component.html',
  styleUrls: ['./persona-strategy.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => PersonaStrategyComponent) }]
})
export class PersonaStrategyComponent extends TemplateComponent implements OnDestroy{
  params: string = TemplateParams;
  contentData: PersonaStrategyTemplateData['template_params_json'];

  prefix: string = 'persona_strategy_';
  inputState: number;
  buyerPersonasList$: Observable<BuyerPersona[]>;

  inputPrefixes: object = {
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

  relevantMessaging: object[] = [
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

  protected init(): void {
    // @ts-ignore - template_params_json.inputs property causes error with TypeScript 3.1
    this.contentData = (this.data.data.template_params_json as PersonaStrategyTemplateData['template_params_json']);
    this.inputState = Number(this.contentData.step_type_select.substr(0, 1));
    this.initStates();

    this.buyerPersonasList$ = this.buyerPersonasService.getBuyerPersonas();
  }

  initStates(): void {
   Object.values(this.inputPrefixes).forEach(el => el.count = this.getPrefixCount(el.name));
  }

  getPrefixCount(prefix: string): number[] {
    const prefixCount = Object.keys(this.inputs).filter(el => el.includes(prefix)).slice(-1).pop();
    if (!prefixCount) {
      return [];
    }
    return this.makeIterable(+prefixCount.split('_').slice(-2).shift());
  }

  makeIterable(number: number): number[] {
    return Array.from(Array(number + 1).keys()).slice(1);
  }

  getDescription(): string {
    return 'Buyer Persona strategy';
  }

  getName(): string {
    return 'Persona Strategy';
  }

  hasInputs(): boolean {
    return true;
  }
}
