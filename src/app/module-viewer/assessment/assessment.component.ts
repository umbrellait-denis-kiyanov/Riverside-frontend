import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AssessmentGroup, AssessmentQuestion, AssessmentOrgGroup, AssessmentAnswer, AssessmentType } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass']
})
export class AssessmentComponent implements OnInit {

  questions$: Observable<AssessmentQuestion[]>;

  answers$: Observable<AssessmentOrgGroup>;

  activeGroup$: Observable<AssessmentGroup>;

  activeType$: Observable<AssessmentType>;

  answerUpdated$ = new BehaviorSubject<boolean>(false);

  importance = [1, 2, 3, 4, 5];

  errors = {};

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  ngOnInit() {
    this.activeType$ = this.navService.assessmentType$;

    this.activeGroup$ = this.navService.assessmentGroup$.pipe(filter(g => !!g));

    this.questions$ = combineLatest(this.activeGroup$, this.navService.organization$).pipe(
      switchMap(([group, orgId]) => {
        this.errors = {};
        return this.asmService.getQuestions(group);
      })
    );

    this.answers$ = combineLatest(this.activeGroup$, this.navService.assessmentType$, this.navService.organization$, this.answerUpdated$).pipe(
      switchMap(([group, type, orgId]) => this.asmService.getAnswers(group, type, orgId))
    );
  }

  setAnswer(q: AssessmentQuestion, t: AssessmentType, answer: boolean) {
    delete this.errors[q.id];
    this.asmService.saveAnswer(q, t, this.navService.lastOrganization.current, answer).subscribe(_ => this.answerUpdated$.next(true));
  }

  saveNotes(q: AssessmentQuestion, t: AssessmentType, a: AssessmentAnswer) {
    this.asmService.saveNotes(q, t, this.navService.lastOrganization.current, a.notes).subscribe();
  }

  questionTrack(idx: number, q: AssessmentQuestion) {
    return q.id;
  }

  setImportance(g: AssessmentGroup, t: AssessmentType, importance) {
    this.asmService.setImportance(g, t, this.navService.lastOrganization.current, importance).subscribe(_ => this.answerUpdated$.next(true));
  }

  markAsDone(activeGroup: AssessmentGroup, t: AssessmentType, questions: AssessmentQuestion[], answers) {
    this.errors = questions
      .filter(q => !answers.answers[q.id] || answers.answers[q.id].answer === null)
      .reduce((errors, q) => {
        errors[q.id] = true;
        return errors;
      }, {});

    if (Object.values(this.errors).length) {
      return;
    }

    this.asmService.markAsDone(activeGroup, t, this.navService.lastOrganization.current).subscribe(_ => this.answerUpdated$.next(true));
  }

  isSectionReady(questions: AssessmentQuestion[], answers) {
    return !(questions.filter(q => !answers.answers[q.id] || answers.answers[q.id].answer === null).length);
  }
}
