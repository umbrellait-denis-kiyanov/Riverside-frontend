interface PreviousStepInputs {
  [key: string]: {
    prefix: string;
    sufix?: string;
  };
}

export class PersonaInputs {
  static defaults = {
    activePersonas: [],
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
    const {activePersonas, previousSteps} = this.options;
    if (!previousSteps) { return; }
    this.fromPreviousSteps = [];
    activePersonas.forEach((persona: string) => {
      const i = parseInt(persona.split('_').pop(), 10);
      const personaDefs = {};
      Object.keys(previousSteps).forEach(stepKey => {
        const stepDef = previousSteps[stepKey];
        personaDefs[stepKey] = `${stepDef.prefix}_${i}${stepDef.sufix ? '_' + stepDef.sufix : ''}`;
      });
      this.fromPreviousSteps.push(personaDefs);
    });
  }

  prepareCurrentInputIds() {
    const {activePersonas, stepPrefix, stepSufix} = this.options;
    if (!stepPrefix) { return; }
    activePersonas.forEach((persona: string) => {
      const i = parseInt(persona.split('_').pop(), 10);
      this.personas.push(`${stepPrefix}_${i}${stepSufix ? '_' + stepSufix : ''}`);
    });
  }
}
