import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { UserService } from 'src/app/common/services/user.service';
import Message from '../../inbox/message.model';
import { IceService } from '../../ice/ice.service';

type actions = 'mark_as_done' | 'feedback' | 'provide_feedback' | 'final_feedback' | 'provide_final_feedback' | 'approve';
@Component({
  selector: 'module-nav',
  templateUrl: './module-nav.component.html',
  styleUrls: ['./module-nav.component.sass']
})
export class ModuleNavComponent implements OnInit {
  showPrevious = true;
  showNext = true;
  @Input() action: actions;
  @Input() subaction: actions;
  @Input() submitting: boolean;
  @Input() is_done: boolean;
  @Input() is_subaction_done: boolean;
  @Input() hideActionButton: boolean;
  @Output() feedback: EventEmitter<Partial<Message>> = new EventEmitter();

  constructor(
    private navService: ModuleNavService,
    private userService: UserService,
    private iceService: IceService,
  ) { }

  ngOnInit() {
    this.prepareActionFlag('is_done', this.action);
    this.subaction && this.prepareActionFlag('is_subaction_done', this.subaction);
    this.iceService.onUnapprove.subscribe(() => {
      this.markAsApproved(!!this.subaction, false);
      this.markAsDone(!!this.subaction, false);
    });
  }

  prepareActionFlag(doneKey: string, action: actions) {
    const {currentStep: {is_checked, is_approved, waiting_for_feedback, feedback_received}} = this.navService;
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
    // this.navService.nextStep();
  }

  markAsDone(isSubaction: boolean = false, state: boolean = null) {
    const key = isSubaction ? 'is_subaction_done' : 'is_done';
    this.navService.markAsDone(this.navService.currentStep.id, !this[key]).then(() => {
      this[key] = state !== null ? state : !this[key];
      this[key] && this.navService.nextStep();
    });
  }

  markAsApproved(isSubaction: boolean = false, state: boolean = null) {
    const key = isSubaction ? 'is_subaction_done' : 'is_done';
    this.navService.markAsApproved(this.navService.currentStep.id, !this[key]).then(() => {
      this[key] = state !== null ? state : !this[key];
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
