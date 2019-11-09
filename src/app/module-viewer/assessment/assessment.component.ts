import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { AssessmentGroup, AssessmentQuestion, AssessmentOrgGroup, AssessmentAnswer, AssessmentType } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { switchMap, filter, map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass']
})
export class AssessmentComponent implements OnInit, OnDestroy {

  questions$: Observable<AssessmentQuestion[]>;

  answersRequest$: Observable<HttpResponse<AssessmentOrgGroup>>;

  answers$: Observable<AssessmentOrgGroup>;

  activeGroup$: Observable<AssessmentGroup>;

  activeType$: Observable<AssessmentType>;

  answerUpdated$ = new BehaviorSubject<boolean>(false);

  importance = [1, 2, 3, 4, 5];

  errors = {};

  resetSelectAll = false;
  resetSelectAllSub: Subscription;

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

    this.resetSelectAllSub = combineLatest(this.activeGroup$, this.navService.assessmentType$, this.navService.organization$).subscribe(_ => {
      this.resetSelectAll = true;
      setTimeout(_ => this.resetSelectAll = false);
    });

    this.answersRequest$ = combineLatest(this.activeGroup$, this.navService.assessmentType$, this.navService.organization$, this.answerUpdated$).pipe(
      switchMap(([group, type, orgId]) => this.asmService.getAnswers(group, type, orgId)),
      shareReplay(1)
    );

    this.answers$ = this.answersRequest$.pipe(map(response => {
      return response.body;
    }));
  }

  ngOnDestroy() {
    this.resetSelectAllSub.unsubscribe();
  }

  setAnswer(q: AssessmentQuestion, t: AssessmentType, answer: boolean) {
    delete this.errors[q.id];
    this.asmService.saveAnswer(q, t, this.navService.lastOrganization.current, answer).subscribe(_ => this.answerUpdated$.next(true));
  }

  answerAll(g: AssessmentGroup, t: AssessmentType, answer: boolean) {
    this.asmService.answerAll(g, t, this.navService.lastOrganization.current, answer).subscribe(_ => this.answerUpdated$.next(true));
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
