import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { Module } from '../../common/interfaces/module.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { InboxService } from '../inbox/inbox.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-request-feedback',
  templateUrl: './request-feedback.component.html',
  styleUrls: ['./request-feedback.component.sass']
})
export class RequestFeedbackComponent implements OnInit {

  @Input() params: any;

  public Editor = InlineEditor;
  ready = false;
  module: Module;
  message: string = '';
  submitting = false;

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

  submit() {
    this.inboxService.save({
      message: this.message,
      module_id: this.module.id,
      from_org_id: this.userService.me.org.id
    }).then(() => {
      this.modal.dismiss();
    });
  }
}
