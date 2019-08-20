import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { UserService } from 'src/app/common/services/user.service';
import Message from '../../inbox/message.model';

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
  @Output() feedback: EventEmitter<Partial<Message>> = new EventEmitter();

  constructor(
    private navService: ModuleNavService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.prepareActionFlag('is_done', this.action);
    this.subaction && this.prepareActionFlag('is_subaction_done', this.subaction);
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
    const partialMessage: Partial<Message> = {
      module_id: this.navService.module.current.id,
      step_id: this.navService.currentStep.id
    };
    if (['feedback', 'final_feedback'].includes(this.action)) {
      partialMessage.from_org_id = this.userService.me.org.id;
    } else {
      partialMessage.to_org_id = this.userService.me.org.id;
    }
    this.feedback.emit(partialMessage);
    this.is_done = true;
    // this.navService.nextStep();
  }

  markAsDone(isSubaction: boolean = false) {
    const key = isSubaction ? 'is_subaction_done' : 'is_done';
    this.navService.markAsDone(this.navService.currentStep.id, !this[key]).then(() => {
      this[key] = !this[key];
      this[key] && this.navService.nextStep();
    });
  }

  markAsApproved(isSubaction: boolean = false) {
    const key = isSubaction ? 'is_subaction_done' : 'is_done';
    this.navService.markAsApproved(this.navService.currentStep.id, !this[key]).then(() => {
      this[key] = !this[key];
      this.is_done && this.navService.nextStep();
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
