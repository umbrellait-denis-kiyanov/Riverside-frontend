import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { menus } from './menus';
import { LeftMenuService } from '../../common/services/left-menu.service';
import { UserService } from '../../common/services/user.service';
import User from '../../common/interfaces/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxService } from '../inbox/inbox.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

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
    private inboxService: InboxService,
    public navService: ModuleNavService,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.leftMenuService.onExpand.subscribe((expand) => {
      this.showMenu = !expand;
      expand ? this.renderer.addClass(this.el.nativeElement, 'expanded') : this.renderer.removeClass(this.el.nativeElement, 'expanded');
    });
    this.me = this.userService.me;
    this.initialLoad();

    this.menus.forEach(item => {
      if (item.linkFn) {
        item.linkObservable = item.linkFn(this.navService);
      }

      if (item.labelFn) {
        item.labelObservable = item.labelFn(this.navService);
      }

      if (item.render) {
        item.renderObservable = item.render(this.me);
      }

      if (item.restrict) {
        item.restrictObservable = combineLatest(of(this.me), this.route.params).pipe(
          map(([user]) => item.restrict({user, nav: this.navService}))
        );
      }
    });
  }

  toggleMenu() {
    this.leftMenuService.expand = !this.leftMenuService.expand;
  }

  showMenuItem(menuItem: typeof menus[number]) {
    return menuItem.restrict ? menuItem.restrict({
      user: this.me,
      nav: this.navService
    }) : true;
  }

  openModal(component: any, params?: any) {
    const modalRef = this.modalService.open(component);
    if (params) {
      modalRef.componentInstance.params = params;
    }
  }

  initialLoad() {
    this.inboxLoad();
    this.inboxService.allMessages.change.subscribe(this.inboxLoad.bind(this));
  }

  inboxLoad() {
    this.inboxService.loadCounter().then((res: any) => {
      const menu = this.menus.find(m => m.label === 'INBOX');
      if (menu) {
        menu.counter = Number(res.counter);
      }
    });
  }
}
