import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { header } from './mockData';
import { E3TableHeader } from 'src/app/common/components/e3-table/e3-table.interface';
import { InboxService } from '../../inbox/inbox.service';
import { ResourceFromServer } from 'src/app/common/services/resource.class';
import Message, { MessageRow } from '../../inbox/message.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'inbox-left-menu',
  templateUrl: './inbox-left-menu.component.html',
  styleUrls: ['./inbox-left-menu.component.sass']
})
export class InboxLeftMenuComponent implements OnInit {

  @Input() width: number = 500;
  messagesResource: ResourceFromServer<Message[]>;
  header: E3TableHeader = header;
  ready = false;
  data: Partial<MessageRow>[];

  constructor(
    private leftMenuService: LeftMenuService,
    private inboxService: InboxService

  ) { }

  ngOnInit() {
    this.inboxService.loadAll();
    this.messagesResource = this.inboxService.allMessages;
    this.messagesResource.ready.pipe(filter(r => r)).subscribe(r => {
      this.ready = r;
      this.prepareData();
      this.messagesResource.change.subscribe(this.prepareData.bind(this));
    });
  }

  collapse() {
    this.leftMenuService.expand = false;
  }

  prepareData() {
    this.data = this.messagesResource.data.map((row) => {
      const message = Message.fromObject(row) as Partial<MessageRow>;
      message.link = ['/inbox', String(message.id)];
      message.tdClassName = !message.read_on ? 'pending' : '';
      return message;
    });
  }

}
