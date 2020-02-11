import { Component, OnInit, Input } from '@angular/core';

import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'account-left-menu',
  templateUrl: './account-left-menu.component.html',
  styleUrls: ['./account-left-menu.component.sass']
})
export class AccountLeftMenuComponent implements OnInit {
  @Input() width = 350;

  constructor(
    private leftMenuService: LeftMenuService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  signout() {
    this.userService.signout().subscribe();
  }

  collapse() {
    this.leftMenuService.expand = false;
  }
}
