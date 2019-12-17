import { Component, OnInit } from '@angular/core';
import { InboxService } from './inbox.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/common/services/user.service';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import Message from './message.model';
import toastr from 'src/app/common/lib/toastr';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.sass']
})
export class InboxComponent implements OnInit {

  senderLetter: string;
  ready: boolean = false;
  feedbackMessage: string = '';
  routerLink: string[];
  submitting: Subscription;
  canProvideFeedback = false;
  currentTab = 'text';

  message$: Observable<Message>;

  constructor(
    private inboxService: InboxService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.canProvideFeedback = this.userService.me.permissions.riversideProvideFeedback;
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
    this.message$ = this.inboxService.load(id).pipe(
      map(message => {
        this.markAsReadIfNeeded(message);
        return this.prepareData(message);
      })
    );
  }

  private markAsReadIfNeeded(message) {
    if (message.is_pending) {
      this.inboxService.markAsRead(message.id).subscribe();
    }
  }

  private prepareData(message: Message): Message {
    if (!message.message) {
      message.message = `<p>No message was provided.</p>`;
    }

    this.routerLink = ['/org', String(message.to_org_id || message.from_org_id), 'module', String(message.module_id)];
    if (message.step_id) {
      this.routerLink = this.routerLink.concat(['step', String(message.step_id)]);
    }

    return message;
  }

  provideFeedback(message: Message, text: string) {
    this.submitting = this.inboxService.save({
      assessment_session_id: message.assessment_session_id,
      to_org_id: message.from_org_id,
      module_id: message.module_id,
      parent_id: message.id,
      message: text
    }).subscribe(_ => toastr.success('Message sent!'));
  }
}
