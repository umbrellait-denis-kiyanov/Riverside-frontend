interface PreviousStepInputs {
  [key: string]: {
    prefix: string;
    sufix?: string;
  };
}

export class PersonaInputs {
  static defaults = {
    numberOfPersonas: 6,
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
    const {numberOfPersonas, previousSteps} = this.options;
    if (!previousSteps) { return; }
    this.fromPreviousSteps = [];
    Array.from({ length: numberOfPersonas }).forEach((_, i: number) => {
      const personaDefs = {};
      Object.keys(previousSteps).forEach(stepKey => {
        const stepDef = previousSteps[stepKey];
        personaDefs[stepKey] = `${stepDef.prefix}_${i + 1}${stepDef.sufix ? '_' + stepDef.sufix : ''}`;
      });
      this.fromPreviousSteps.push(personaDefs);
    });
  }

  prepareCurrentInputIds() {
    const {numberOfPersonas, stepPrefix, stepSufix} = this.options;
    if (!stepPrefix) { return; }
    Array.from({ length: numberOfPersonas }).forEach((_, i: number) => {
      this.personas.push(`${stepPrefix}_${i + 1}${stepSufix ? '_' + stepSufix : ''}`);
    });
  }
}
