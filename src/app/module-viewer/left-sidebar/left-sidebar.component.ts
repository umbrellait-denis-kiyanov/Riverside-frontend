import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { menus } from './menus';
import { LeftMenuService } from '../../common/services/left-menu.service';
import { UserService } from '../../common/services/user.service';
import User from '../../common/interfaces/user.model';
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
  expand: boolean;

  constructor(
    private leftMenuService: LeftMenuService,
    private userService: UserService,
    private modalService: NgbModal,
    private el: ElementRef,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    this.leftMenuService.onExpand.subscribe((expand) => {
      this.showMenu = !expand;
      expand ? this.renderer.addClass(this.el.nativeElement, 'expanded'): this.renderer.removeClass(this.el.nativeElement, 'expanded')  ;
    });
    this.me = this.userService.me;
  }

  toggleMenu() {
    this.leftMenuService.expand = !this.leftMenuService.expand;
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
