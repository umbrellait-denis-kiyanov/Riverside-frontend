import { Component, OnInit, ElementRef } from '@angular/core';
import { PersonaInputs } from '../persona-ids.class';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { FinalFeedbackTemplateData } from './final-feedback.interface';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { InboxService } from 'src/app/module-viewer/inbox/inbox.service';
import { UserService } from 'src/app/common/services/user.service';
import { TemplateComponent } from '../template-base.cass';
import Message from 'src/app/module-viewer/inbox/message.model';
import { data } from './exampleData';
import { FeedbackSectionTemplateComponent } from '../feedback_section/feedback_section.component';

@Component({
  selector: 'app-final-feedback',
  templateUrl: './final-feedback.component.html',
  styleUrls: ['./final-feedback.component.sass']
})
export class FinalFeedbackComponent extends FeedbackSectionTemplateComponent implements OnInit  {
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

  protected initAction() {
    if (this.userService.me.roles.is_riverside_managing_director) {
      this.action = 'provide_final_feedback';
      this.subaction = 'approve';
    } else { this.action = 'final_feedback'; }
  }
}
