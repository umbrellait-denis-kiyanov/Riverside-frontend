import { Component, OnInit, Input } from '@angular/core';
import {
  Module,
  Step,
  Organization
} from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { Router } from '@angular/router';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'module-left-menu',
  templateUrl: './module-left-menu.component.html',
  styleUrls: ['./module-left-menu.component.sass']
})
export class LeftMenuComponent implements OnInit {
  @Input() width = 300;

  me: User;

  module$: Observable<Module>;
  organizationsList$: Observable<Organization[]>;

  lockMessageStep$ = new BehaviorSubject<number>(null);
  lockMessageClearTimeout: number;

  constructor(
    private moduleService: ModuleService,
    private userService: UserService,
    private leftMenuService: LeftMenuService,
    private navService: ModuleNavService,
    private router: Router
  ) {}

  ngOnInit() {
    this.me = this.userService.me;

    this.module$ = this.navService.moduleDataReplay$;
    this.organizationsList$ = this.navService.module$.pipe(
      switchMap(id => this.moduleService.getOrganizationsByModule(id))
    );
  }

  collapse() {
    this.leftMenuService.expand = false;
  }

  canEdit() {
    return (
      this.me.permissions.riversideRequestFeedback ||
      this.me.permissions.riversideProvideFeedback
    );
  }

  // todo: rewrite as pipe or set property?
  isChecked(step: Step) {
    return (
      step.is_checked ||
      step.is_approved ||
      step.waiting_for_feedback ||
      step.feedback_received
    );
  }

  // todo: rewrite as pipe
  stepRouterLink(module: Module, step: Step) {
    if (!module.status) {
      return;
    }

    if (!step.isLocked) {
      return [
        '/org',
        module.status.org_id,
        'module',
        module.id,
        'step',
        step.id
      ];
    } else {
      return [
        '/org',
        module.status.org_id,
        'module',
        module.id,
        'step',
        this.navService.step.current
      ];
    }
  }

  setOrganization(organization: Organization, module: Module) {
    if (this.navService.lastOrganization.current === organization.id) {
      return;
    }

    this.navService.lastOrganization.current = organization.id;

    this.navService.step$.pipe(take(1)).subscribe(step => {
      this.router.navigate([
        'org',
        organization.id,
        'module',
        module.id,
        'step',
        step
      ]);
    });
  }

  showLockMessage(step: Step) {
    if (!step.isLocked) {
      this.hideLockMessage();

      return;
    }

    clearTimeout(this.lockMessageClearTimeout);
    this.lockMessageStep$.next(step.id);
    this.lockMessageClearTimeout = window.setTimeout(
      _ => this.lockMessageStep$.next(null),
      5000
    );
  }

  hideLockMessage() {
    clearTimeout(this.lockMessageClearTimeout);
    this.lockMessageStep$.next(null);
  }
}
