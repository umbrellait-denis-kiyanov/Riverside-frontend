import { Component, ElementRef, OnInit } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { Template3Data } from './template3.interface';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import Message from 'src/app/module-viewer/inbox/message.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { InboxService } from 'src/app/module-viewer/inbox/inbox.service';

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
  message: string;
  submitting: boolean = false;
  // contentData: Template3Data['template_params_json'];
  contentData = data;

  constructor(
    protected el: ElementRef,
    protected moduleContentService: ModuleContentService,
    private inboxService: InboxService
  ) {
    super(el, moduleContentService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.inboxService.message.saving.subscribe(s => this.submitting = s);
  }

  protected init() {
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id] = this.inputs[id] || '';
      });
    });
    // this.contentData = this.data.data.template_params_json;
  }

  requestFeedbackClicked(partialMessage: Partial<Message>) {
    const message = {
      message: this.message,
      ...partialMessage
    };
    this.inboxService.save(message);
  }
}
