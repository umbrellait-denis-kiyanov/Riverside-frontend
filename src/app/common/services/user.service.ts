import { Injectable, EventEmitter } from '@angular/core';
import User from '../interfaces/user.model';
import {
  AccountProfile,
  UpdatePassword,
  PresignedProfilePictureUrl
} from '../interfaces/account.interface';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  get me(): User {
    return this.meChanged.getValue();
  }
  set me(_value: User) {
    this.meChanged.next(_value);
  }

  meChanged: BehaviorSubject<User> = new BehaviorSubject(null);

  accountBaseUrl = '/api/account';

  constructor(private httpClient: HttpClient) {}

  setMeFromData(data: any) {
    this.me = User.fromObject<User>(data);
  }

  getAccount(): Observable<AccountProfile> {
    return this.httpClient.get<AccountProfile>(`${this.accountBaseUrl}/me`);
  }

  saveAccount(account: AccountProfile): Observable<any> {
    return this.httpClient.post<any>(`${this.accountBaseUrl}/me`, account);
  }

  updatePassword(data: UpdatePassword): Observable<any> {
    return this.httpClient.post<any>(
      `${this.accountBaseUrl}/me/password`,
      data
    );
  }

  presignedProfilePictureUpload(
    ext: string
  ): Observable<PresignedProfilePictureUrl> {
    return this.httpClient.get<any>(`${this.accountBaseUrl}/me/upload-picture`, {
      params: { ext }
    });
  }
}
