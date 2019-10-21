import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Module, Step, Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearningElementComponent } from '../../modals/learning-element/learning-element.component';
import toastr from 'src/app/common/lib/toastr';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap, catchError, tap, startWith } from 'rxjs/operators';

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

  constructor(
    private moduleService: ModuleService,
    private modalService: NgbModal,
    private userService: UserService,
    private leftMenuService: LeftMenuService,
    private navService: ModuleNavService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.me = this.userService.me;

    this.route.params.pipe(
      switchMap(params => this.moduleService.getModuleConfig(params.id)),
      catchError(err => this.moduleService.getDefaultModule())
    ).subscribe(module => this.navService.module.current = module.id);

    this.module$ = combineLatest(this.navService.organization$,
                                 this.navService.module.onChange.pipe(startWith(this.navService.module.current), filter(m => !!m)),
                                 this.moduleService.moduleChanged$
                                )
      .pipe(
        tap(([orgId]) => this.orgId = orgId),
        switchMap(([orgId, module]) => this.moduleService.getOrgModule(module, orgId))
      );

    window.$('#datepicker').datepicker({
      dateFormat: 'dd M yy'
    });
  }

  collapse() {
    this.leftMenuService.expand = false;
  }

  openElement(element: Step['elements'][number]) {
    const modalRef = this.modalService.open(LearningElementComponent, { windowClass: 'learning-element-modal' });
    modalRef.componentInstance.element = element;
  }

  canEdit() {
    return this.me.permissions.riversideRequestFeedback || this.me.permissions.riversideProvideFeedback;
  }

  isChecked(step: Step) {
    return step.is_checked || step.is_approved || step.waiting_for_feedback || step.feedback_received;
  }

  stepRouterLink(module: Module, step: Step) {
    return ['/org', this.orgId, 'module', module.id , 'step', step.id ];
  }

  setOrganization(organization: Organization, module: Module) {
    this.navService.lastOrganization.current = organization.id;
    this.router.navigate(['org', organization.id, 'module', module.id, 'step', this.navService.step.current]);
  }
}
