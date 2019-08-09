import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import Message from '../../inbox/message.model';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'module-nav',
  templateUrl: './module-nav.component.html',
  styleUrls: ['./module-nav.component.sass']
})
export class ModuleNavComponent implements OnInit {
  showPrevious = true;
  showNext = true;
  @Input() action: 'mark_as_done' | 'feedback' | 'provide_feedback' | 'final_feedback' | 'provide_final_feedback';
  @Input() submitting: boolean;
  @Input() is_done: boolean;
  @Output() feedback: EventEmitter<Partial<Message>> = new EventEmitter();

  constructor(
    private navService: ModuleNavService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    const {currentStep: {is_checked, waiting_for_feedback, feedback_received}} = this.navService;
    switch (this.action) {
      case 'feedback':
      case 'final_feedback':
        this.is_done = waiting_for_feedback;
        break;
      case 'provide_feedback':
      case 'provide_final_feedback':
        this.is_done = feedback_received;
        break;
      default:
        this.is_done = is_checked;
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

  markAsDone() {
    this.navService.markAsDone(this.navService.currentStep.id, !this.is_done).then(() => {
      this.is_done = !this.is_done;
      this.is_done && this.navService.nextStep();
    });
  }

  buttonClicked() {
    switch (this.action) {
      case 'feedback':
      case 'provide_feedback':
      case 'final_feedback':
      case 'provide_final_feedback':
        this.feedbackClicked();
        break;
      default:
        this.markAsDone();
    }
  }

  actionButtonText() {
    switch (this.action) {
      case 'feedback':
        return this.is_done ? 'Feedback Requested' : 'Request Feedback';
      case 'provide_feedback':
      case 'provide_final_feedback':
        return this.is_done ? 'Feedback Provided' : 'Provide Feedback';
      case 'final_feedback':
        return this.is_done ? 'Submitted' : 'Submit';
      default:
        return this.is_done ? 'Done' : 'Mark as done';
    }
  }
}
