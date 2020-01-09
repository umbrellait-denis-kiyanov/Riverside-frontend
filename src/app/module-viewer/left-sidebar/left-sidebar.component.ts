import { Component, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { menus } from './menus';
import { LeftMenuService } from '../../common/services/left-menu.service';
import { UserService } from '../../common/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxService } from '../inbox/inbox.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestFeedbackComponent } from '../request-feedback/request-feedback.component';

@Component({
  selector: 'left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.sass']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  menus = menus;
  showMenu = false;
  expand: boolean;

  routerLinkActiveUpdateWorkaround = {exact: false};
  updateWorkaroundWatch: Subscription;

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

    this.initialLoad();

    this.menus.forEach(item => {
      if (item.linkFn) {
        item.linkObservable = item.linkFn(this.navService);
      }

      if (item.labelFn) {
        item.labelObservable = item.labelFn(this.navService);
      }

      if (item.render) {
        item.renderObservable = item.render(this.userService.meChanged);
      }

      if (item.restrict) {
        item.restrictObservable = combineLatest(this.userService.meChanged, this.route.params).pipe(
          map(([user]) => item.restrict({user, nav: this.navService}))
        );
      }
    });

    // we have to force the reevaluation of routerLinkActive state, otherwise the module menu item is sometimes not highlighted automatically
    // https://github.com/angular/angular/issues/13865#issuecomment-308841643
    this.updateWorkaroundWatch = this.navService.moduleDataReplay$.subscribe(_ => {
      this.routerLinkActiveUpdateWorkaround = { exact: false };
    });
  }

  ngOnDestroy() {
    this.updateWorkaroundWatch.unsubscribe();
  }

  toggleMenu() {
    this.leftMenuService.expand = !this.leftMenuService.expand;
  }

  openModal(component: typeof RequestFeedbackComponent) {
    this.modalService.open(component);
  }

  initialLoad() {
    this.inboxLoad();
    this.inboxService.allMessages.change.subscribe(this.inboxLoad.bind(this));
  }

  inboxLoad() {
    this.inboxService.loadCounter().then((res: {counter: number}) => {
      const menu = this.menus.find(m => m.label === 'INBOX');
      if (menu) {
        menu.counter = Number(res.counter);
      }
    });
  }
}
