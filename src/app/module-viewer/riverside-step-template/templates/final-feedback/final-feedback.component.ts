import { Component, OnInit, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { data } from './exampleData';
import { FeedbackSectionTemplateComponent } from '../feedback_section/feedback_section.component';
import { TemplateParams } from '.';

@Component({
  selector: 'app-final-feedback',
  templateUrl: './final-feedback.component.html',
  styleUrls: ['./final-feedback.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => FinalFeedbackComponent) }]
})
export class FinalFeedbackComponent extends FeedbackSectionTemplateComponent {
  params = TemplateParams;
  contentData = data;

  columnBoxes = [
    [
      {
        title: 'The Buying Process',
        inputId: (index: number) => `persona_behavior_${index + 1}_buying_process`
      }
    ],
    [
      {
        title: 'Challenges',
        inputId: (index: number) => `persona_behavior_${index + 1}_challenges`
      },
      {
        title: 'Common Objections',
        inputId: (index: number) => `persona_behavior_${index + 1}_common_objections`
      },
      {
        title: 'Goals',
        inputId: (index: number) => `persona_behavior_${index + 1}_goals`
      }
    ],
    [
      {
        title: 'Priorities',
        inputId: (index: number) => `persona_behavior_${index + 1}_priorities`
      },
      {
        title: 'Means',
        inputId: (index: number) => `persona_behavior_${index + 1}_means`
      },
      {
        title: 'Metrics',
        inputId: (index: number) => `persona_behavior_${index + 1}_metrics`
      },
      {
        title: 'Trigger Events',
        inputId: (index: number) => `persona_behavior_${index + 1}_trigger_events`
      }
    ]
  ];

  getDescription() {
    return '';
  }

  getName() {
    return 'Final Feedback';
  }
}
