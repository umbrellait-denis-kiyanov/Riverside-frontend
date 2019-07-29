import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { messages } from '../left-menu/inbox/mockData';
import { ResourceFromServer } from 'src/app/common/services/resource.class';

@Injectable()
export class InboxService {

  allMessages = new ResourceFromServer<typeof messages>();
  message = new ResourceFromServer<typeof messages[number]>();

  constructor() { }

  loadAll() {
    return this.allMessages.load(Promise.resolve(messages));
  }

  load({id}) {
    return this.message.load(Promise.resolve(messages[0]));
  }
}
