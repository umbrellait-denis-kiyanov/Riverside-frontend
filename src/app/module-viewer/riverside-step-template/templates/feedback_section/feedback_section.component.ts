import { Component, OnInit } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import Message from 'src/app/module-viewer/inbox/message.model';
import { InboxService } from 'src/app/module-viewer/inbox/inbox.service';
import { PersonaInputs } from '../persona-ids.class';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { ActivatedRoute } from '@angular/router';


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
  subaction: string;
  currentSection: string;
  currentTab = 'text';

  private inboxService: InboxService;
  private navService: ModuleNavService;
  private route: ActivatedRoute;

  getDescription() {
    return '';
  }

  getName() {
    return 'Request Feedback';
  }

  ngOnInit() {
    super.ngOnInit();

    this.inboxService = this.injectorObj.get(InboxService);
    this.navService = this.injectorObj.get(ModuleNavService);
    this.route = this.injectorObj.get(ActivatedRoute);

    this.inboxService.message.saving.subscribe(s => this.submitting = s);
    this.initAction();
  }

  protected initAction() {
    if (this.userService.me.permissions.riversideProvideFeedback) {
      this.action = 'provide_feedback';
      this.subaction = 'approve';
    } else { this.action = 'feedback'; }
  }

  protected init() {
    this.initIds();
    ['fromPreviousSteps'].forEach(key => {
      this.inputIds[key].forEach((persona) => {
        Object.values(persona).forEach((id2: string) => {
          this.inputs[id2].content = this.inputs[id2].content || '';
          this.allIds.push(id2);
        });
      });
    });
  }

  initIds() {
    this.inputIds = new PersonaInputs({
      activePersonas: this.activePersonas,
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

  feedbackClicked(msg: string) {
    const partialMessage: Partial<Message> = {
      module_id: this.navService.module.current,
      step_id: this.navService.step.current
    };
    const {orgId} = this.route.parent.snapshot.params;
    if (['feedback', 'final_feedback'].includes(this.action)) {
      partialMessage.from_org_id = orgId;
    } else {
      partialMessage.to_org_id = orgId;
    }
    const message = {
      message: msg,
      ...partialMessage
    };
    this.inboxService.save(message).then(() => {
      this.moduleService.reloadModule();
    });
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section: string ) {
    window.scrollBy({
      top: document.querySelector('#' + section).getBoundingClientRect().top - 75,
      left: 0, behavior: 'smooth'
    });
    // setTimeout(()=>window.scrollBy(0, -75));
  }

}
