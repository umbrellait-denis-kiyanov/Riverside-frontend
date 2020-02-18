import { Component, forwardRef, OnDestroy } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { PersonaStrategyTemplateData, TemplateParams } from '.';
import { BuyerPersona } from '../../../../common/interfaces/buyer-persona.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-persona-strategy',
  templateUrl: './persona-strategy.component.html',
  styleUrls: ['./persona-strategy.component.sass'],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => PersonaStrategyComponent)
    }
  ]
})
export class PersonaStrategyComponent extends TemplateComponent
  implements OnDestroy {
  params: string = TemplateParams;
  contentData: PersonaStrategyTemplateData['template_params_json'];

  prefix = 'persona_strategy_';
  inputState: number;
  buyerPersonasList$: Observable<BuyerPersona[]>;

  inputPrefixes: object = {
    '1_key_issues': {
      name: 'issues',
      count: [],
      emptyQuestions: []
    },
    '2_additional_questions': {
      name: 'questions',
      count: [],
      emptyQuestions: []
    },
    '3_message_flow': {
      name: 'message',
      count: [],
      emptyQuestions: []
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
    this.contentData = this.data.data
      .template_params_json as PersonaStrategyTemplateData['template_params_json'];
    this.inputState = Number(this.contentData.step_type_select.substr(0, 1));
    this.buyerPersonasList$ = this.buyerPersonasService.getBuyerPersonas();

    this.initStates();
  }

  initStates(): void {
    Object.values(this.inputPrefixes).forEach(
      el => (el.count = this.getIterablePrefixCount(el.name))
    );
    const messages = this.inputPrefixes['2_additional_questions'];
    const messagesInputs = this.getIterableQuestionsInputsCount();
    messages.emptyQuestions = messages.emptyQuestions.concat(
      messages.count.map(inputIndex => {
        return messagesInputs.some(messageIndex => {
          const input = this.inputs[
            `${this.prefix}${messages.name}_${inputIndex}_${messageIndex}`
          ];

          return input && this.notEmpty(input.content);
        });
      })
    );
  }

  getIterablePrefixCount(prefix: string): number[] {
    const prefixName = this.getPrefixFullName(prefix);
    if (!prefixName) {
      return [];
    }

    return this.makeIterable(
      +prefixName
        .split('_')
        .slice(-2)
        .shift()
    );
  }

  getIterableQuestionsInputsCount(): number[] {
    const questionsInputName = this.getPrefixFullName(
      this.inputPrefixes['2_additional_questions'].name
    );
    if (!questionsInputName) {
      return [];
    }

    return this.makeIterable(+questionsInputName.split('_').pop());
  }

  getPrefixFullName(prefix: string): string {
    return Object.keys(this.inputs)
      .filter(el => el.includes(prefix))
      .slice(-1)
      .pop();
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
