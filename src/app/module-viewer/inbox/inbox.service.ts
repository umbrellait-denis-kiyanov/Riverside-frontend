import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Message from './message.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable()
export class InboxService {
  baseUrl = environment.apiRoot + '/api/modules';

  messageChange$ = new BehaviorSubject(false);

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  loadAll() {
    return this.http.get<Message[]>(this.baseUrl + `/0/feedback`);
  }

  loadCounter() {
    return this.http.get<{ counter: number }>(
      this.baseUrl + `/0/feedback/counter`
    );
  }

  load(id) {
    return this.http.get<Message>(this.baseUrl + `/0/feedback/${id}`);
  }

  save(message: Partial<Message & { parent_id: number }>) {
    return this.http
      .post(
        this.baseUrl + '/' + Number(message.module_id).toString() + `/feedback`,
        message
      )
      .pipe(tap(_ => this.toastr.success('Message sent!')));
  }

  markAsRead(id: number) {
    return this.http
      .post(this.baseUrl + `/0/feedback/${id}/read`, {})
      .pipe(tap(_ => this.messageChange$.next(true)));
  }
}
