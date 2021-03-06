import { Component, OnInit } from '@angular/core';
import { TemplateComponent } from '../templates/template-base.class';
import Message from '../../inbox/message.model';
import { InboxService } from '../../inbox/inbox.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'module-feedback',
  templateUrl: './module-feedback.component.html',
  styleUrls: ['./module-feedback.component.sass']
})
export class ModuleFeedbackComponent implements OnInit {
  action = 'feedback';
  subaction = '';
  message = '';
  currentTab = 'text';
  submitting: Subscription;
  submittingSubaction: Subscription;

  constructor(
    public template: TemplateComponent,
    private navService: ModuleNavService,
    private moduleService: ModuleService,
    private userService: UserService,
    private inboxService: InboxService
  ) {}

  ngOnInit() {
    if (this.userService.me.permissions.riversideProvideFeedback) {
      this.action = 'provide_feedback';
      this.subaction = 'approve';
    }
  }

  feedbackClicked(msg: string) {
    const message: Partial<Message> = {
      module_id: this.navService.module.current,
      step_id: this.navService.step.current,
      message: msg
    };

    const orgId = this.navService.lastOrganization.current;
    if (this.userService.me.permissions.riversideProvideFeedback) {
      message.to_org_id = orgId;
    } else {
      message.from_org_id = orgId;
    }

    this.submitting = this.inboxService.save(message).subscribe(() => {
      this.moduleService.reloadModule();
    });
  }
}
