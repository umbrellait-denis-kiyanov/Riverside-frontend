import { Component, ElementRef, OnInit } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { FeedbackSectionTemplateData } from './feedback_section.interface';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import Message from 'src/app/module-viewer/inbox/message.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { InboxService } from 'src/app/module-viewer/inbox/inbox.service';
import { UserService } from 'src/app/common/services/user.service';
import { PersonaInputs } from '../persona-ids.class';


@Component({
  selector: 'app-feedback_section',
  templateUrl: './feedback_section.component.html',
  styleUrls: ['./feedback_section.component.sass']
})
export class FeedbackSectionTemplateComponent extends TemplateComponent implements OnInit {
  allIds: string[] = [];
  inputIds: PersonaInputs;

  Editor = InlineEditor;
  message: string = '';
  submitting: boolean = false;
  // contentData: FinalFeedbackTemplateData['template_params_json'];
  contentData = data;
  action: string;

  constructor(
    protected el: ElementRef,
    protected moduleContentService: ModuleContentService,
    private inboxService: InboxService,
    protected userService: UserService
  ) {
    super(el, moduleContentService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.inboxService.message.saving.subscribe(s => this.submitting = s);
    this.initAction();
  }

  protected initAction() {
    if (this.userService.me.roles.riverside_se) {
      this.action = 'provide_feedback';
    } else { this.action = 'feedback'; }
  }

  protected init() {
    this.initIds();
    ['fromPreviousSteps'].forEach(key => {
      this.inputIds[key].forEach((persona) => {
        Object.values(persona).forEach((id2: string) => {
          this.inputs[id2] = this.inputs[id2] || '';
          this.allIds.push(id2);
        });
      });
    });
    // this.contentData = this.data.data.template_params_json;
  }

  initIds() {
    this.inputIds = new PersonaInputs({
      numberOfPersonas: 6,
      previousSteps: {
        title: {
          prefix: 'persona'
        },
        name: {
          prefix: 'persona_name'
        },
        picture: {
          prefix: 'persona_picture'
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
  }

  behaviorInputs() {
    const behaviorInputs = {};
    this.contentData.steps.forEach(step => {
      behaviorInputs[step.sufix] = {
        prefix: 'persona_behavior',
        sufix: step.sufix
      };
    });
    return behaviorInputs;
  }

  feedbackClicked(partialMessage: Partial<Message>) {
    const message = {
      message: this.message,
      ...partialMessage
    };
    this.inboxService.save(message);
  }

  notEmpty(el: string) {
    return !!this.textContent(el);
  }

  textContent(el: string) {
    const _el: HTMLElement[] = window.$(el);
    return _el.length ? _el[0].textContent.replace(/\&nbsp;/g, ' ') : '';
  }
}
