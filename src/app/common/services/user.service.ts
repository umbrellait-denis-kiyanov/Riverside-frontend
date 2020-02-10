import { Injectable } from '@angular/core';
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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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

  legacyBaseUrl = environment.apiRoot;

  sessionSecondsTimeLeft =  120;

  checkSessionTimeLeftInterval =  60000;

  intervalSubscriptionId: Subscription;

  isSessionPopupOpen = false;

  isSessionExpired = false;

  constructor(private httpClient: HttpClient, private router: Router, private modalService: NgbModal ) {}

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

    if ( this.intervalSubscriptionId ) {
      this.intervalSubscriptionId.unsubscribe();
    }

    this.intervalSubscriptionId = this.getAccount().pipe(
        catchError( err => of(err)),
        switchMap( account => !account ? of(null) : interval(this.checkSessionTimeLeftInterval))
    ).subscribe( id => {
      if ( id ) {
        this.checkTimeLeft();
      }
      return id;
    });
  }

  signin(credentials: FormData): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.legacyBaseUrl}/signin/`, credentials).pipe(
      tap(res => {
        if (res) {
          this.getAccount().subscribe(account => this.setMeFromData(account));
          this.isSessionPopupOpen = false;
          this.startCheckingSessionTime();
        }
      })
    );
  }

  signout(): Observable<AccountProfileStatus> {
    if ( this.intervalSubscriptionId ) {
      this.intervalSubscriptionId.unsubscribe();
    }
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
    if ( !this.isSessionPopupOpen ) {
      const modalRef = this.modalService.open(SessionExpirationModalComponent);
      this.isSessionPopupOpen = true;
      modalRef.result.then( ( result: boolean ) => {
        if ( !result ) {
          this.intervalSubscriptionId.unsubscribe();
          this.isSessionExpired = true;
          this.signout().subscribe( s => this.router.navigate(['login']) );
        } else {
          this.isSessionPopupOpen = false;
          this.intervalSubscriptionId = this.getAccount().pipe(
              switchMap(account => interval(this.checkSessionTimeLeftInterval))
          ).subscribe( id => {
            this.checkTimeLeft();
          } );
        }
      } );
      modalRef.componentInstance.timer = timer;
    } else {
      this.intervalSubscriptionId.unsubscribe();
    }
  }

  checkTimeLeft() {
    return this.httpClient.get(this.accountSessionRemainingTimeUrl).subscribe(
        (response: { timeleft: number } ) => {
                if ( response ) {
                  const timeLeft = +response.timeleft;
                  if ( timeLeft && timeLeft <= this.sessionSecondsTimeLeft ) {
                    const minutes = timeLeft / 60;
                    const seconds = timeLeft % 60;
                    this.showTimeLeftModal(new Date(1, 1, 1, 1, minutes, 0));
                  }
                }
        },
        (error) => {
          this.router.navigate(['login']);
        }
    );
  }

}
