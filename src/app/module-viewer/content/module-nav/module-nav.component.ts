import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { UserService } from 'src/app/common/services/user.service';
import Message from '../../inbox/message.model';
import { IceService } from '../../ice/ice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from 'src/app/common/services/module.service';

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

  unApproveSub: Subscription;

  constructor(
    private navService: ModuleNavService,
    private moduleService: ModuleService,
    private userService: UserService,
    private iceService: IceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.prepareActionFlag('is_done', this.action);
    this.subaction && this.prepareActionFlag('is_subaction_done', this.subaction);
    this.unApproveSub && this.unApproveSub.unsubscribe();
    this.unApproveSub = this.iceService.onUnapprove.subscribe(() => {
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
    const newState = state !== null ? state : !this[key];
    const { stepId } = this.route.snapshot.params;
    const module = this.navService.module.current;
    this.moduleService.markAsDone(module, this.navService.lastOrganization.current, stepId, newState)
      .subscribe(_ => {
        this[key] = newState;
        this[key] && this.navService.nextStep();

        const stepIndex = this.navService.setStepFromId(stepId);
        const step = module.steps[stepIndex];
        if (step) {
          step.is_checked = newState;
        }
        this.moduleService.updateProgress(module);
      });
  }

  markAsApproved(isSubaction: boolean = false, state: boolean = null) {
    const key = isSubaction ? 'is_subaction_done' : 'is_done';
    const newState = state !== null ? state : !this[key];
    const { stepId } = this.route.snapshot.params;
    const module = this.navService.module.current;

    this.moduleService.markAsApproved(module, this.navService.lastOrganization.current, stepId, newState)
      .subscribe((response: number[]) => {

        const stepIndex = this.navService.setStepFromId(stepId);
        const step = module.steps[stepIndex];

        if (step) {
          step.is_approved = newState;
          if (step.is_approved) {
            this.navService.onApprove.emit(true);
            this.iceService.onApprove.emit();
            if (!this.navService.currentStep.requires_feedback) {
              this.navService.nextStep();
            }
          } else {
            this.navService.onUnapprove.emit();
            if (!this.navService.currentStep.requires_feedback) {
              this.navService.reloadModule();
            }
          }
        }

        response.forEach(id => module.steps.find(st => st.id === id).is_approved = state);

        this.moduleService.updateProgress(module);

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
