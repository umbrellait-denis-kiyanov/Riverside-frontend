import { Component, ElementRef, OnInit } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { FeedbackSectionTemplateData } from './feedback_section.interface';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import Message from 'src/app/module-viewer/inbox/message.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { InboxService } from 'src/app/module-viewer/inbox/inbox.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-feedback_section',
  templateUrl: './feedback_section.component.html',
  styleUrls: ['./feedback_section.component.sass']
})
export class FeedbackSectionTemplateComponent extends TemplateComponent implements OnInit {
  allIds: string[] = [];
  inputIds = {
    fromPreviousStep: [
      {
        name: 'persona_name_1',
        title: 'persona_1',
      },
      {
        name: 'persona_name_2',
        title: 'persona_2',
      },
      {
        name: 'persona_name_3',
        title: 'persona_3',
      },
      {
        name: 'persona_name_4',
        title: 'persona_4',
      },
      {
        name: 'persona_name_5',
        title: 'persona_5',
      },
      {
        name: 'persona_name_6',
        title: 'persona_6',
      }
    ]
  };
  Editor = InlineEditor;
  message: string = '';
  submitting: boolean = false;
  // contentData: FeedbackSectionTemplateData['template_params_json'];
  contentData = data;
  action: string;

  constructor(
    protected el: ElementRef,
    protected moduleContentService: ModuleContentService,
    private inboxService: InboxService,
    private userService: UserService
  ) {
    super(el, moduleContentService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.inboxService.message.saving.subscribe(s => this.submitting = s);
    if (this.userService.me.roles.riverside_se) {
      this.action = 'provide_feedback';
    } else { this.action = 'feedback'; }
  }

  protected init() {

    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach((persona) => {
        this.prepareBehaviors(persona);

        Object.values(persona).forEach((id2: string) => {
          this.inputs[id2] = this.inputs[id2] || '';
          this.allIds.push(id2);
        });
      });
    });
    // this.contentData = this.data.data.template_params_json;
  }

  prepareBehaviors(persona: {title: string}) {
    this.contentData.steps && this.contentData.steps.forEach(step => {
      const idBehavior = persona.title.replace('persona', 'persona_behavior') + '_' + step.sufix;
      this.inputs[idBehavior] = this.inputs[idBehavior] || '';
      this.allIds.push(idBehavior);
    });
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
