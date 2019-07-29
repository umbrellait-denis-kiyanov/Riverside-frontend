import { Component, OnInit } from '@angular/core';
import { InboxService } from './inbox.service';
import { filter, first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private inboxService: InboxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.loadMessage();
      } else {
        this.ready = true;
      }
    });

  }

  loadMessage() {
    this.inboxService.load({ id: 1 });
    this.messageResource = this.inboxService.message;
    this.messageResource.ready.pipe(filter(v => v)).pipe(first()).subscribe(() => {
      this.senderLetter = this.messageResource.data.sender[0].toLocaleUpperCase();
      this.message = this.messageResource.data;
      this.ready = true;
    });
  }

}
