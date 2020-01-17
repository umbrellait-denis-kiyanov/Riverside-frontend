import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Module } from '../../common/interfaces/module.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { InboxService } from '../inbox/inbox.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-request-feedback',
  templateUrl: './request-feedback.component.html',
  styleUrls: ['./request-feedback.component.sass']
})
export class RequestFeedbackComponent implements OnInit {

  module$: Observable<Module>;
  submitting: Subscription;
  message: string = '';
  currentTab: string = 'text';

  constructor(
    public modal: NgbActiveModal,
    private navService: ModuleNavService,
    private inboxService: InboxService
  ) { }

  ngOnInit() {
    this.module$ = this.navService.moduleDataReplay$;
  }

  submit(message: string) {
    this.submitting = this.inboxService.save({
      message,
      module_id: this.navService.module.current,
      step_id: this.navService.step.current,
      from_org_id: this.navService.lastOrganization.current
    }).subscribe(() => {
      this.modal.dismiss();
    });
  }

}
