import { Injectable, EventEmitter } from '@angular/core';
import User from '../interfaces/user.model';
import {
  AccountProfile,
  UpdatePassword,
  PresignedProfilePictureUrl
} from '../interfaces/account.interface';
import {Observable, BehaviorSubject, of, interval, Subscription, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {SessionExpirationModalComponent} from '../components/session-expiration-modal/session-expiration-modal.component';

type AccountProfileStatus = AccountProfile & {status: string};

@Injectable()
export class UserService {

  get me(): User {
    return this.meChanged.getValue();
  }
  set me(_value: User) {
    this.meChanged.next(_value);
  }

  meChanged: BehaviorSubject<User> = new BehaviorSubject(null);

  accountBaseUrl = environment.apiRoot + '/api/account';

  accountSessionRemainingTimeUrl = environment.apiRoot + '/timeout';

  sessionSecondsTimeLeft: number =  120;

  checkSessionTimeLeftInterval: number =  60000;

  legacyBaseUrl = environment.apiRoot;

  intervalSubscriptionId: Subscription;

  constructor(private httpClient: HttpClient, private router: Router, private modalService: NgbModal) {}

  setMeFromData(data: any) {
    this.me = User.fromObject<User>(data);
  }

  getAccount(): Observable<AccountProfileStatus> {
      return this.httpClient.get<AccountProfileStatus>(`${this.legacyBaseUrl}/user/me`).pipe(
        catchError(err => {
          this.router.navigate(['login']);
          return of(null);
        }
      ));
  }

  startCheckingSessionTime() {

    this.getAccount().subscribe( result => {
      if ( result ) {
        this.intervalSubscriptionId = interval(this.checkSessionTimeLeftInterval).subscribe( (val: number) => {
          this.checkTimeLeft();
        });
      }
    });
  }

  signin(credentials: FormData): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.legacyBaseUrl}/signin/`, credentials).pipe(
      tap(res => {
        if (res) {
          this.getAccount().subscribe(account => this.setMeFromData(account));
          this.startCheckingSessionTime();
        }
      })
    );
  }

  signout(): Observable<AccountProfileStatus> {
    return this.httpClient.get(`${this.legacyBaseUrl}/signout?legacy_no_redirect=true`).pipe(
      switchMap(res => this.getAccount())
    );
  }

  saveAccount(account: AccountProfile): Observable<null> {
    return this.httpClient.post<null>(`${this.accountBaseUrl}/me`, account);
  }

  updatePassword(data: UpdatePassword): Observable<null> {
    return this.httpClient.post<null>(
      `${this.accountBaseUrl}/me/password`,
      data
    );
  }

  presignedProfilePictureUpload(
    ext: string
  ): Observable<PresignedProfilePictureUrl> {
    return this.httpClient.get<null>(`${this.accountBaseUrl}/me/upload-picture`, {
      params: { ext }
    });
  }

  showTimeLeftModal(timer: Date) {

    if ( !this.modalService.hasOpenModals() ) {

      const modalRef = this.modalService.open(SessionExpirationModalComponent);
      modalRef.result.then( ( result: boolean ) => {

        if ( result === false ) {

          this.intervalSubscriptionId.unsubscribe();
          this.signout().subscribe( s => this.router.navigate(['login']) );

        } else {

          this.getAccount().subscribe( );

        }

      } );

      modalRef.componentInstance.timer = timer;

    }

  }

  checkTimeLeft() {

    return this.httpClient.get(this.accountSessionRemainingTimeUrl).subscribe( (response: { timeleft: number } ) => {

      const timeLeft = +response.timeleft;

      if ( timeLeft && timeLeft <= this.sessionSecondsTimeLeft ) {

        const minutes = timeLeft / 60;
        const seconds = timeLeft % 60;

        this.showTimeLeftModal(new Date(1, 1, 1, 1, minutes, seconds));

      }// if

    });
  }

}
