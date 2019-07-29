import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { LeftMenuService } from 'src/app/common/services/left-menu.service';


declare global {
  interface Window { $: any; }
}

@Component({
  selector: 'account-left-menu',
  templateUrl: './account-left-menu.component.html',
  styleUrls: ['./account-left-menu.component.sass']
})
export class AccountLeftMenuComponent implements OnInit {

  @Input() width: number = 500;

  constructor(
    private leftMenuService: LeftMenuService,

  ) { }

  ngOnInit() {

  }

  collapse() {
    this.leftMenuService.expand = false;
  }


}
