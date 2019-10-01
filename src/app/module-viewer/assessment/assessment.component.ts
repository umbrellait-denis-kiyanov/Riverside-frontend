import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AssessmentType, AssessmentGroup, AssessmentQuestion } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass']
})
export class AssessmentComponent implements OnInit {

  questions$: Observable<AssessmentQuestion[]>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  ngOnInit() {
    this.activeGroup$ = this.navService.assessmentGroup$;

    this.questions$ = this.activeGroup$.pipe(
      mergeMap((group: AssessmentGroup) => {
        return this.asmService.getQuestions(group);
      })
    );
  }

}
