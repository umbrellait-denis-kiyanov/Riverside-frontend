import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Module } from '../../common/interfaces/module.interface';
import { AssessmentType } from '../../common/interfaces/assessment.interface';
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
  assessment : any;
  assessmentSessionId :number;
  submitting: Subscription;
  message: string = '';
  currentTab: string = 'text';
  isAssessmentPage :boolean = false;

  constructor(
    public modal: NgbActiveModal,
    private navService: ModuleNavService,
    private inboxService: InboxService
  ) { }


  ngOnInit() {
    this.module$ = this.navService.moduleDataReplay$;
    if(window.location.href.indexOf("/assessment") > -1){
      this.isAssessmentPage = true;
      this.navService.activeAssessmentType$.subscribe(assessment => { 
        this.assessment = assessment;
      }); 
      this.navService.activeAssessmentSessionId$.subscribe(assessmentSessionId => { 
        this.assessmentSessionId = assessmentSessionId;
      }); 
    }
       
  }

  submit(message: string) {
    if(this.isAssessmentPage){
      //Assessment feedback
      this.submitting = this.inboxService.save({
        assessment_session_id: this.assessmentSessionId,
        from_org_id: this.navService.lastOrganization.current,
        module_id: 0,
        parent_id: 0,
        isAssessmentFeedback: true,
        message: message
      }).subscribe(() => {
        this.modal.dismiss();
      });
    }else{
      //Module feedback 
      this.submitting = this.inboxService.save({
        message,
        module_id: this.navService.module.current,
        step_id: this.navService.step.current,
        from_org_id: this.navService.lastOrganization.current,
        isAssessmentFeedback: false
      }).subscribe(() => {
        this.modal.dismiss();
      });
    }
  }
}
