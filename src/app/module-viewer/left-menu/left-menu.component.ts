import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Module, Step } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearningElementComponent } from '../modals/learning-element/learning-element.component';
import toastr from 'src/app/common/lib/toastr';

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

  constructor(
    private moduleService: ModuleService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.module.percComplete = this.module.percComplete || 0;
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
}
