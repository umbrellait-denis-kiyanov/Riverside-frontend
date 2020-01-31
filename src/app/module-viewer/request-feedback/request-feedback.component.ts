import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Module } from '../../common/interfaces/module.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { InboxService } from '../inbox/inbox.service';
import { Observable, Subscription } from 'rxjs';
import { take } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-feedback',
  templateUrl: './request-feedback.component.html',
  styleUrls: ['./request-feedback.component.sass']
})
export class RequestFeedbackComponent implements OnInit {

  module$: Observable<Module>;
  assessmentSessionId :number;
  submitting: Subscription;
  message: string = '';
  currentTab: string = 'text';
  isAssessmentPage :boolean = false;

  constructor(
    public modal: NgbActiveModal,
    private navService: ModuleNavService,
    private inboxService: InboxService,
    private router: Router
  ) { }

  ngOnInit() {
    this.module$ = this.navService.moduleDataReplay$;
    if(this.router.url.indexOf("/assessment") > -1){
      this.isAssessmentPage = true;
      this.navService.activeAssessmentSessionId$.pipe(take(1)).subscribe(assessmentSessionId => { 
        this.assessmentSessionId = assessmentSessionId;
      }); 
    }
  }

  submit(message: string) {
    const msg = {
      assessment_session_id: 0,
      from_org_id : this.navService.lastOrganization.current,
      module_id : 0,
      parent_id : 0,
      step_id : 0,
      isAssessmentFeedback: false,
      message: message
    }
    if(this.isAssessmentPage){
      //Assessment feedback
      msg.assessment_session_id = this.assessmentSessionId;
      msg.isAssessmentFeedback  = true;
    }else{
      //Module feedback 
      msg.module_id = this.navService.module.current,
      msg.step_id = this.navService.step.current;
    }
    this.inboxService.save(msg).subscribe(() => this.modal.dismiss());
  }
}
