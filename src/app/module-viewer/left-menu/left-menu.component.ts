import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Module, Step } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearningElementComponent } from '../modals/learning-element/learning-element.component';
import toastr from 'src/app/common/lib/toastr';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';

declare global {
  interface Window { $: any; }
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.sass']
})
export class LeftMenuComponent implements OnInit {

  @Input() width: number;
  @Input() module: Module;
  @Output() collapse = new EventEmitter();
  sending = false;
  me: User;

  constructor(
    private moduleService: ModuleService,
    private modalService: NgbModal,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.module.percComplete = this.module.percComplete || 0;
    this.me = this.userService.me;
    window.$('#datepicker').datepicker({
      dateFormat: 'dd M yy'
    });
  }

  onExpand() {
    this.collapse.emit();
  }

  updateProgress() {
    this.moduleService.updateProgress(this.module);
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
