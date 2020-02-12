import { take } from 'rxjs/operators';

interface PreviousStepInputs {
  [key: string]: {
    prefix: string;
    sufix?: string;
  };
}

export class PersonaInputs {
  static defaults = {
    buyerPersonasList$: null,
    stepPrefix: '',
    stepSufix: '',
    previousSteps: null
  };

  options: typeof PersonaInputs.defaults & {previousSteps?: PreviousStepInputs};
  fromPreviousSteps: Array<{[key: string]: string}>;
  personas: string[];

  constructor(options: Partial<typeof PersonaInputs.defaults> = {}) {
    this.options = {...PersonaInputs.defaults, ...options};
    this.preparePreviousInputIds();
    this.prepareCurrentInputIds();
  }

  preparePreviousInputIds() {
    const {buyerPersonasList$, previousSteps} = this.options;
    if (!previousSteps) { return; }
    this.fromPreviousSteps = [];
    buyerPersonasList$
        .pipe(take(1))
        .subscribe (personas => this.fromPreviousSteps.push(...personas.map(persona => {
            const personaDefs = {};
            Object.keys(previousSteps).forEach(stepKey => {
              if (stepKey === 'title') {
                  personaDefs[stepKey] = persona;
                  return;
              }
              const stepDef = previousSteps[stepKey];
              personaDefs[stepKey] = `${stepDef.prefix}_${persona.index}${stepDef.sufix ? '_' + stepDef.sufix : ''}`;
            });
            return personaDefs;
            })
          )
        );
  }

prepareCurrentInputIds() {
    const {buyerPersonasList$, stepPrefix, stepSufix} = this.options;
    if (!stepPrefix) { return; }
    buyerPersonasList$
        .pipe(take(1))
        .subscribe (personas => this.fromPreviousSteps.push(...personas.map(persona =>
            `${stepPrefix}_${persona.index}${stepSufix ? '_' + stepSufix : ''}`)));
  }
}
