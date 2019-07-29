import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import {messages, header} from './mockData';
import { E3TableData, E3TableHeader } from 'src/app/common/components/e3-table/e3-table.interface';
import { InboxService } from '../../inbox/inbox.service';
import { ResourceFromServer } from 'src/app/common/services/resource.class';

declare global {
  interface Window { $: any; }
}

@Component({
  selector: 'inbox-left-menu',
  templateUrl: './inbox-left-menu.component.html',
  styleUrls: ['./inbox-left-menu.component.sass']
})
export class InboxLeftMenuComponent implements OnInit {

  @Input() width: number = 500;
  messagesResource: ResourceFromServer<typeof messages>;
  header: E3TableHeader = header;

  constructor(
    private leftMenuService: LeftMenuService,
    private inboxService: InboxService

  ) { }

  ngOnInit() {
    this.inboxService.loadAll();
    this.messagesResource = this.inboxService.allMessages;
  }

  collapse() {
    this.leftMenuService.expand = false;
  }


}
