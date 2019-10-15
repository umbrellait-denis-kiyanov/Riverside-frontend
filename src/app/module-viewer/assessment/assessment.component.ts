import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AssessmentGroup, AssessmentQuestion, AssessmentOrgGroup, AssessmentAnswer } from 'src/app/common/interfaces/assessment.interface';
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

  answerUpdated$ = new BehaviorSubject<boolean>(false);

  importance = [1, 2, 3, 4, 5];

  errors = {};

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  ngOnInit() {
    this.activeGroup$ = this.navService.assessmentGroup$.pipe(filter(g => !!g));

    this.questions$ = combineLatest(this.activeGroup$, this.navService.organization$).pipe(
      switchMap(([group, orgId]) => {
        this.errors = {};
        return this.asmService.getQuestions(group);
      })
    );

    this.answers$ = combineLatest(this.activeGroup$, this.navService.organization$, this.answerUpdated$).pipe(
      switchMap(([group, orgId]) => this.asmService.getAnswers(group, orgId))
    );
  }

  setAnswer(q: AssessmentQuestion, answer: boolean) {
    delete this.errors[q.id];
    this.asmService.saveAnswer(q, this.navService.lastOrganization.current, answer).subscribe(_ => this.answerUpdated$.next(true));
  }

  saveNotes(q: AssessmentQuestion, a: AssessmentAnswer) {
    this.asmService.saveNotes(q, this.navService.lastOrganization.current, a.notes).subscribe();
  }

  questionTrack(idx: number, q: AssessmentQuestion) {
    return q.id;
  }

  setImportance(g: AssessmentGroup, importance) {
    this.asmService.setImportance(g, this.navService.lastOrganization.current, importance).subscribe(_ => this.answerUpdated$.next(true));
  }

  markAsDone(activeGroup: AssessmentGroup, questions: AssessmentQuestion[], answers) {
    this.errors = questions
      .filter(q => !answers.answers[q.id] || answers.answers[q.id].answer === null)
      .reduce((errors, q) => {
        errors[q.id] = true;
        return errors;
      }, {});

    if (Object.values(this.errors).length) {
      return;
    }

    this.asmService.markAsDone(activeGroup, this.navService.lastOrganization.current).subscribe(_ => this.answerUpdated$.next(true));
  }

  isSectionReady(questions: AssessmentQuestion[], answers) {
    return !(questions.filter(q => !answers.answers[q.id] || answers.answers[q.id].answer === null).length);
  }
}
