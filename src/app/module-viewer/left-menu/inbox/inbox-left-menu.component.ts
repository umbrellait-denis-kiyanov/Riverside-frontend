import { Component, OnInit, Input } from '@angular/core';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { header } from './mockData';
import { E3TableHeader, E3TableDataRow } from 'src/app/common/components/e3-table';
import { InboxService } from '../../inbox/inbox.service';
import Message from '../../inbox/message.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'inbox-left-menu',
  templateUrl: './inbox-left-menu.component.html',
  styleUrls: ['./inbox-left-menu.component.sass']
})
export class InboxLeftMenuComponent implements OnInit {

  @Input() width: number = 500;
  header: E3TableHeader = header;
  messages$: Observable<E3TableDataRow[]>;

  constructor(
    private leftMenuService: LeftMenuService,
    private inboxService: InboxService
  ) { }

  ngOnInit() {
    this.messages$ = this.inboxService.loadAll().pipe(map(this.prepareData.bind(this)));
  }

  collapse() {
    this.leftMenuService.expand = false;
  }

  prepareData(messages: Message[]) {
    return messages.map((row) => {
      const message = {} as E3TableDataRow;
      message.link = ['/inbox', String(row.id)];
      message.className = !row.read_on ? 'pending' : '';
      message.onClick = () => message.className = message.className.split('pending').join('');
      message.cells = this.header.map(col => ({value: row[col.id]}));
      return message;
    });
  }
}
