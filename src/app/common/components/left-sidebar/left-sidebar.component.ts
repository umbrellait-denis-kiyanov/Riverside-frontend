import { Component, OnInit } from '@angular/core';
import { menus } from './menus';
import { LeftMenuService } from '../../services/left-menu.service';
import { UserService } from '../../services/user.service';
import User from '../../interfaces/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.sass']
})
export class LeftSidebarComponent implements OnInit {
  menus = menus;
  showMenu = false;
  me: User;

  constructor(
    private leftMenuService: LeftMenuService,
    private userService: UserService,
    private modalService: NgbModal
    ) { }

  ngOnInit() {
    this.leftMenuService.onExpand.subscribe((expand) => this.showMenu = !expand);
    this.me = this.userService.me;
  }

  expandMenu() {
    this.leftMenuService.expand = true;
  }

  showMenuItem(menuItem: typeof menus[number]) {
    return menuItem.restrict ? menuItem.restrict(this.me) : true;
  }

  openModal(component: any, params?: any) {
    const modalRef = this.modalService.open(component);
    if (params) {
      modalRef.componentInstance.params = params;
    }
  }
}
