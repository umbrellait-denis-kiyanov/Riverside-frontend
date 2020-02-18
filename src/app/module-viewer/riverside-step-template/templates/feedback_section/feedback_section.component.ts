import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { data } from './exampleData';
import { PersonaInputs } from '../persona-ids.class';
import txt from '!!raw-loader!./index.ts';

@Component({
  selector: 'app-feedback_section',
  templateUrl: './feedback_section.component.html',
  styleUrls: ['./feedback_section.component.sass'],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => FeedbackSectionTemplateComponent)
    }
  ]
})
export class FeedbackSectionTemplateComponent extends TemplateComponent {
  inputIds: PersonaInputs;

  contentData = data;
  params = txt;
  currentSection: string;

  isNavCarousel = false;

  getDescription() {
    return '';
  }

  getName() {
    return 'Request Feedback';
  }

  protected init() {
    this.inputIds = new PersonaInputs({
      buyerPersonasList$: this.buyerPersonasList$,
      previousSteps: {
        title: {
          prefix: 'persona'
        },
        age: {
          prefix: 'persona_age'
        },
        perc_male: {
          prefix: 'persona_perc_male'
        },
        perc_female: {
          prefix: 'persona_perc_female'
        },
        education: {
          prefix: 'persona_education'
        },
        ...this.behaviorInputs()
      }
    });

    this.isNavCarousel =
      this.contentOptions &&
      this.contentOptions.nav &&
      this.contentOptions.nav === 'slides';
  }

  behaviorInputs() {
    return this.contentData.steps.reduce((inputs, step) => {
      inputs[step.sufix] = {
        prefix: 'persona_behavior',
        sufix: step.sufix
      };

      return inputs;
    }, {});
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section: string) {
    window.scrollBy({
      top:
        document.querySelector('#' + section).getBoundingClientRect().top - 75,
      left: 0,
      behavior: 'smooth'
    });
  }
}
