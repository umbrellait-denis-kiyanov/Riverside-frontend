import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResourceFromServer } from 'src/app/common/services/resource.class';
import Message from './message.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InboxService {

  allMessages = new ResourceFromServer<Message[]>();
  message = new ResourceFromServer<Message>({ saveMessage: 'Message sent!' });

  constructor(private http: HttpClient) { }

  loadAll() {
    return this.http.get<Message[]>(`/api/modules/0/feedback`);
  }

  loadCounter() {
    return this.http.get(`/api/modules/0/feedback/counter`).toPromise();
  }

  load({ id }) {
    return this.message.load(
      this.http.get(`/api/modules/0/feedback/${id}`).toPromise()
    );
  }

  save(message: Partial<Message & { parent_id: number }>) {
    return this.message.save(
      this.http.post(
        `/api/modules/` + Number(message.module_id) + `/feedback`,
        message
      ).toPromise()
    );
  }

  markAsRead(id: number) {
    return this.http.post(`/api/modules/0/feedback/${id}/read`, {});
  }
}
