import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../common/services/user.service';
import User from '../common/interfaces/user.model';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-module-viewer-root',
  templateUrl: './module-viewer-root.component.html',
  styleUrls: ['./module-viewer-root.component.sass']
})
export class ModuleViewerRootComponent implements OnInit {

  me$: Observable<User>;

  me: User;

  constructor(private userService: UserService, private router: Router) {

    this.userService.startCheckTime();

    this.me$ = this.userService.getAccount().pipe(
      catchError(err => this.router.navigate(['login'])),
      map(user => {
        this.userService.setMeFromData(user);
        this.me = this.userService.me;
        return this.userService.me;
      })
    );
  }

  ngOnInit() {
    // (document.querySelector('.loading-site-content') as HTMLElement).style.display = 'none';
  }

}

