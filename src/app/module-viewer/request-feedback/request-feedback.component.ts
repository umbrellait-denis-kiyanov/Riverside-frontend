import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Module } from '../../common/interfaces/module.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { InboxService } from '../inbox/inbox.service';
import { UserService } from 'src/app/common/services/user.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-request-feedback',
  templateUrl: './request-feedback.component.html',
  styleUrls: ['./request-feedback.component.sass']
})
export class RequestFeedbackComponent implements OnInit {

  @Input() params: any;

  ready = false;
  module: Module;
  submitting = false;
  message: string = '';
  currentTab: string = 'text';

  constructor(
    public modal: NgbActiveModal,
    private navService: ModuleNavService,
    private inboxService: InboxService,
    private userService: UserService
  ) { }

  ngOnInit() {
    setTimeout(async () => {
      this.module = await this.navService.module.getLast();
      this.ready = true;
    });
    this.inboxService.message.saving.subscribe(s => this.submitting = s);
  }

  submit(message: string) {
    this.inboxService.save({
      message,
      module_id: this.module.id,
      step_id: this.navService.getStepId(),
      from_org_id: this.userService.me.org.id
    }).then(() => {
      this.modal.dismiss();
    });
  }

}
