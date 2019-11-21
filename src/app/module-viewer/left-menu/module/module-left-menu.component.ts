import { Component, OnInit, Input } from '@angular/core';
import { Module, Step, Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { Router } from '@angular/router';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';

declare global {
  interface Window { $: any; }
}

@Component({
  selector: 'module-left-menu',
  templateUrl: './module-left-menu.component.html',
  styleUrls: ['./module-left-menu.component.sass']
})
export class LeftMenuComponent implements OnInit {

  @Input() width: number = 300;

  orgId: number;

  me: User;

  module$: Observable<Module>;

  isLocked: {[key: number]: boolean} = {};

  constructor(
    private moduleService: ModuleService,
    private userService: UserService,
    private leftMenuService: LeftMenuService,
    private navService: ModuleNavService,
    private router: Router
  ) { }

  ngOnInit() {
    this.me = this.userService.me;

    this.module$ = combineLatest(this.navService.organization$,
                                 this.navService.module$,
                                 this.moduleService.moduleChanged$
                                )
      .pipe(
        tap(([orgId]) => this.orgId = orgId),
        switchMap(([orgId, module]) => this.moduleService.getOrgModule(module, orgId)),
        tap(moduleData => {
          const sortedSteps = moduleData.steps.reduce((steps, step) => {
            steps[step.id] = step;
            return steps;
          }, {});

          this.isLocked = moduleData.steps.reduce((locked, step) => {
            locked[step.id] = step.linked_ids.filter(id => !sortedSteps[id].is_checked && !sortedSteps[id].is_approved).length > 0;
            return locked;
          }, {});
        })
      );
  }

  collapse() {
    this.leftMenuService.expand = false;
  }

  canEdit() {
    return this.me.permissions.riversideRequestFeedback || this.me.permissions.riversideProvideFeedback;
  }

  // todo: rewrite as pipe or set property?
  isChecked(step: Step) {
    return step.is_checked || step.is_approved || step.waiting_for_feedback || step.feedback_received;
  }

  // todo: rewrite as pipe
  stepRouterLink(module: Module, step: Step) {
    if (!this.isLocked[step.id]) {
      return ['/org', this.orgId, 'module', module.id, 'step', step.id];
    } else {
      return ['/org', this.orgId, 'module', module.id, 'step', this.navService.step.current];
    }
  }

  setOrganization(organization: Organization, module: Module) {
    this.navService.lastOrganization.current = organization.id;

    this.navService.step$.pipe(take(1)).subscribe(step =>
      this.router.navigate(['org', organization.id, 'module', module.id, 'step', step])
    );
  }
}
