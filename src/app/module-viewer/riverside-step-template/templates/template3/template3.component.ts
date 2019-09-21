import { Component, ElementRef, OnInit } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { Template3Data } from './template3.interface';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import Message from 'src/app/module-viewer/inbox/message.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { InboxService } from 'src/app/module-viewer/inbox/inbox.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-template3',
  templateUrl: './template3.component.html',
  styleUrls: ['./template3.component.sass']
})
export class Template3Component extends TemplateComponent implements OnInit {
  inputIds = {
    fromPreviousStep: [
      'persona_1',
      'persona_2',
      'persona_3',
      'persona_4',
      'persona_5',
      'persona_6',
    ]
  };
  Editor = InlineEditor;
  message: string = '';
  submitting: boolean = false;
  // contentData: Template3Data['template_params_json'];
  contentData = data;
  action: string;

  private inboxService: InboxService;

  getDescription() {
    return '';
  }

  getName() {
    return 'Tpl3';
  }

  ngOnInit() {
    super.ngOnInit();

    this.inboxService = this.injectorObj.get(InboxService);

    this.inboxService.message.saving.subscribe(s => this.submitting = s);
    if (this.userService.me.roles.is_riverside_managing_director) {
      this.action = 'provide_feedback';
    } else { this.action = 'feedback'; }
  }

  protected init() {
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id] = this.inputs[id] || '';
      });
    });
  }

  feedbackClicked(partialMessage: Partial<Message>) {
    const message = {
      message: this.message,
      ...partialMessage
    };
    this.inboxService.save(message);
  }
}
