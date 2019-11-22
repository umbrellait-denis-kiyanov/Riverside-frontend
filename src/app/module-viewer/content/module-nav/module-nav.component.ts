import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import Message from '../../inbox/message.model';
import { IceService } from '../../ice/ice.service';
import { Subscription } from 'rxjs';
import { ModuleService } from 'src/app/common/services/module.service';
import { TemplateContentData } from '../../riverside-step-template/templates/template-data.class';
import { TemplateComponent } from '../../riverside-step-template/templates/template-base.cass';

type actions = 'mark_as_done' | 'feedback' | 'provide_feedback' | 'final_feedback' | 'provide_final_feedback' | 'approve';
@Component({
  selector: 'module-nav',
  templateUrl: './module-nav.component.html',
  styleUrls: ['./module-nav.component.sass']
})
export class ModuleNavComponent implements OnInit {
  showPrevious = true;
  showNext = true;
  @Input() step: TemplateContentData;
  @Input() action: actions;
  @Input() subaction: actions;
  @Input() submitting: boolean;
  @Input() is_done: boolean;
  @Input() is_subaction_done: boolean;
  @Input() hideActionButton: boolean;
  @Output() feedback: EventEmitter<Partial<Message>> = new EventEmitter();

  unApproveSub: Subscription;

  hasValidationError = false;

  constructor(
    private navService: ModuleNavService,
    private moduleService: ModuleService,
    private iceService: IceService,
    private template: TemplateComponent,
  ) { }

  ngOnInit() {
    this.prepareActionFlag('is_done', this.action);
    this.subaction && this.prepareActionFlag('is_subaction_done', this.subaction);

    // todo - what does it do?
    this.unApproveSub && this.unApproveSub.unsubscribe();
    this.unApproveSub = this.iceService.onUnapprove.subscribe(() => {
      this.markAsApproved(!!this.subaction, false);
      this.markAsDone(!!this.subaction, false);
    });
  }

  prepareActionFlag(doneKey: string, action: actions) {
    const {data: {is_checked, is_approved, waiting_for_feedback, feedback_received}} = this.step;
    switch (action) {
      case 'feedback':
      case 'final_feedback':
        this[doneKey] = waiting_for_feedback;
        break;
      case 'provide_feedback':
      case 'provide_final_feedback':
        this[doneKey] = feedback_received;
        break;
      case 'approve':
        this[doneKey] = is_approved;
        break;
      default:
        this[doneKey] = is_checked;
    }
  }

  next() {
    this.navService.nextStep();
  }

  previous() {
    this.navService.previousStep();
  }

  feedbackClicked() {
    this.feedback.emit();
    this.is_done = true;
  }

  markAsDone(isSubaction: boolean = false, state: boolean = null) {
    const key = isSubaction ? 'is_subaction_done' : 'is_done';
    const newState = state !== null ? state : !this[key];
    const step = this.step.data;

    if (newState && this.template && !this.template.validate()) {
      this.hasValidationError = true;
      setTimeout(_ => this.hasValidationError = false, 5000);
      return;
    }

    this.moduleService.markAsDone(step.module_id, step.org_id, step.step_id, newState)
      .subscribe(_ => {
        this.moduleService.moduleChanged$.next(true);

        if (newState) {
          this.navService.nextStep();
        }

        this[key] = newState;
      });
  }

  markAsApproved(isSubaction: boolean = false, state: boolean = null) {
    const key = isSubaction ? 'is_subaction_done' : 'is_done';
    const newState = state !== null ? state : !this[key];
    const step = this.step.data;

    this.moduleService.markAsApproved(step.module_id, step.org_id, step.step_id, newState)
      .subscribe((response: number[]) => {
        this.moduleService.moduleChanged$.next(true);

        if (newState) {
          this.iceService.onApprove.emit();

          if (!step.requires_feedback) {
            setTimeout(_ => this.navService.nextStep());
          }
        }

        this[key] = newState;
      });
  }

  buttonClicked(action?: actions, isSubaction: boolean = false) {
    action = action || this.action;

    switch (action) {
      case 'feedback':
      case 'provide_feedback':
      case 'final_feedback':
      case 'provide_final_feedback':
        this.feedbackClicked();
        break;
      case 'approve':
          this.markAsApproved(isSubaction);
          break;
      default:
        this.markAsDone(isSubaction);
    }
  }

  actionButtonText(doneKey: string = 'is_done', action?: actions) {
    action = action || this.action;

    switch (action) {
      case 'feedback':
        return this[doneKey] ? 'Feedback Requested' : 'Request Feedback';
      case 'provide_feedback':
      case 'provide_final_feedback':
        return this[doneKey] ? 'Feedback Provided' : 'Provide Feedback';
      case 'final_feedback':
        return this[doneKey] ? 'Submitted' : 'Submit';
      case 'approve':
        return this[doneKey] ? 'Approved' : 'Approve';
      default:
        return this[doneKey] ? 'Done' : 'Mark as done';
    }
  }
}
