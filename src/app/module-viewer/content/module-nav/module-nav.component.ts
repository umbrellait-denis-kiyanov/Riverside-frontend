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
  @Input() action: 'mark_as_done' | 'feedback';
  @Input() submitting: boolean;
  @Output() feedback: EventEmitter<Partial<Message>> = new EventEmitter();

  constructor(
    private navService: ModuleNavService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  next() {
    this.navService.nextStep();
  }

  previous() {
    this.navService.previousStep();
  }

  requestFeedbackClicked() {
    const partialMessage: Partial<Message> = {
      module_id: this.navService.module.current.id,
      from_org_id: this.userService.me.org.id,
      step_id: this.navService.currentStep.id

    };
    this.feedback.emit(partialMessage);
  }

}
