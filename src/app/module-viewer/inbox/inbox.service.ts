import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Message from './message.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class InboxService {

  messageChange$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  loadAll() {
    return this.http.get<Message[]>(`/api/modules/0/feedback`);
  }

  loadCounter() {
    return this.http.get<{counter: string}>(`/api/modules/0/feedback/counter`);
  }

  load(id) {
    return this.http.get<Message>(`/api/modules/0/feedback/${id}`);
  }

  save(message: Partial<Message & { parent_id: number }>) {
    return this.http.post(`/api/modules/` + Number(message.module_id) + `/feedback`, message).pipe(
      tap(_ => this.toastr.success('Message sent!'))
    );
  }

  markAsRead(id: number) {
    return this.http.post(`/api/modules/0/feedback/${id}/read`, {}).pipe(
      tap(_ => this.messageChange$.next(true))
    );
  }
}
