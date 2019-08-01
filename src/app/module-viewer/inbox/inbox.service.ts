import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { messages } from '../left-menu/inbox/mockData';
import { ResourceFromServer } from 'src/app/common/services/resource.class';
import Message from './message.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InboxService {

  allMessages = new ResourceFromServer<typeof messages>();
  message = new ResourceFromServer<Message>({saveMessage: 'Message sent!'});

  constructor(private http: HttpClient) { }

  loadAll() {
    return this.allMessages.load(Promise.resolve(messages));
  }

  load({id}) {
    return this.message.load(Promise.resolve(messages[0]));
  }

  save(message: Partial<Message>) {
    return this.message.save(
      this.http.post(
          `/api/modules/${message.module_id}/feedback`,
          message
        ).toPromise()
      );
  }

}
