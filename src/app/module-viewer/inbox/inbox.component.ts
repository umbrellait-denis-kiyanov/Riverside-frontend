import { Component, OnInit } from '@angular/core';
import { InboxService } from './inbox.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/common/services/user.service';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.sass']
})
export class InboxComponent implements OnInit {

  messageResource: InboxService['message'];
  message: InboxService['message']['data'];
  senderLetter: string;
  ready: boolean = false;
  feedbackMessage: string = '';
  routerLink: string[];
  submitting = false;
  canProvideFeedback = false;
  currentTab = 'text';

  constructor(
    private inboxService: InboxService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.canProvideFeedback = this.userService.me.roles.is_riverside_managing_director;
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.ready = false;
        this.loadMessage(params.id);
      } else {
        this.ready = true;
      }
    });

  }

  loadMessage(id: string) {
    this.messageResource = this.inboxService.message;
    this.messageResource.saving.subscribe(s => this.submitting = s);
    this.inboxService.load({ id }).then(res => {
      this.senderLetter = this.messageResource.data.orgName[0].toLocaleUpperCase();
      this.message = this.messageResource.data;
      this.markAsReadIfNeeded();
      this.prepareData();
      this.ready = true;
    });

  }

  private markAsReadIfNeeded() {
    if (this.message.is_pending && this.message.to_org_id) {
    this.inboxService.markAsRead(this.message.id).then(() => {
      const resource = this.inboxService.allMessages;
      const msg = resource.data.find(m => m.id === this.message.id);
      if (msg) {
        msg.is_pending = false;
        resource.change.next(resource.change.getValue() + 1);
      }
    });
    }
  }

  private prepareData() {
    if (!this.message.message) {
      this.message.message = `<p>No message was provided.</p>`;
    }
    this.routerLink = ['/org', String(this.message.to_org_id || this.message.from_org_id), 'module', String(this.message.module_id)];
    if (this.message.step_id) {
      this.routerLink = this.routerLink.concat(['step', String(this.message.step_id)]);
    }
  }

  provideFeedback(message: string) {
    this.inboxService.save({
      to_org_id: this.message.from_org_id,
      module_id: this.message.module_id,
      parent_id: this.message.id,
      message
    }).then(() => {
      const {allMessages: {change, data}} = this.inboxService;
      const msg = data.find(m => m.id === this.message.id);
      if (msg) {
        msg.is_pending = false;
        change.next(change.getValue() + 1);
      }
    });
  }

}
