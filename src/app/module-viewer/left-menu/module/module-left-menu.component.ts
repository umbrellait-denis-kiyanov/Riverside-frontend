import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Module, Step } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearningElementComponent } from '../../modals/learning-element/learning-element.component';
import toastr from 'src/app/common/lib/toastr';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';

declare global {
  interface Window { $: any; }
}

@Component({
  selector: 'module-left-menu',
  templateUrl: './module-left-menu.component.html',
  styleUrls: ['./module-left-menu.component.sass']
})
export class LeftMenuComponent implements OnInit {

  @Input() width: number = 500;

  module: Module;

  sending = false;
  me: User;
  ready = false;

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
    this.route.params.subscribe((params) => {
      if (params.moduleId) {
        this.moduleService.getModule(params.moduleId, String(this.me.org.id)).then(moduleData => {
          if (moduleData) {
            this.module = moduleData;
            this.navService.module.current = moduleData;
          }
          this.module.percComplete = this.module.percComplete || 0;
          this.ready = true;
        });
        if (!this.router.routerState.snapshot.url.includes('step')) {
          this.router.navigate(['module', params.moduleId, 'step', 1]);
        }
      }

    });


    window.$('#datepicker').datepicker({
      dateFormat: 'dd M yy'
    });
  }

  collapse() {
    this.leftMenuService.expand = false;
  }

  updateProgress() {
    this.navService.updateProgress(this.module);
  }

  openElement(element: Step['elements'][number]) {
    const modalRef = this.modalService.open(LearningElementComponent, { windowClass: 'learning-element-modal' });
    modalRef.componentInstance.element = element;
  }

  sendRequest() {
    this.sending = true;
    this.moduleService.requestFeedback(this.module).then(() => {
      this.sending = false;
      toastr.success('An email has been sent with your request');
    });
  }

  canEdit() {
    const { riverside_facilitator, riverside_se, super_admin } = this.me.roles;
    return riverside_facilitator || riverside_se || super_admin;
  }
}
