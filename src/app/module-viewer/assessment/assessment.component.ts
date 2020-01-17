import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { AssessmentGroup, AssessmentQuestion, AssessmentOrgGroup, AssessmentAnswer, AssessmentType } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { switchMap, filter, map, shareReplay, tap, takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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

  isSectionReady$: Observable<boolean>;

  importance = [1, 2, 3, 4, 5];

  errors = {};

  resetSelectAll = false;
  resetSelectAllSub: Subscription;

  markAsDoneSub: Subscription;
  markAsNASub: Subscription;
  clearAnswersSub: Subscription;
  clearNotesSub: Subscription;

  answersLoading: boolean;

  isDestroyed = false;

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService,
              private toastr: ToastrService) { }

  ngOnInit() {

    this.activeType$ = this.navService.assessmentType$;

    this.activeGroup$ = this.navService.assessmentGroup$.pipe(filter(g => !!g));

    this.questions$ = combineLatest(this.activeGroup$, this.navService.organization$).pipe(
      tap(_ => this.answersLoading = true),
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
      takeWhile(_ => !this.isDestroyed),
      switchMap(([group, type, orgId]) => this.asmService.getAnswers(group, type, orgId)),
      shareReplay(1),
    );

    this.answers$ = this.answersRequest$.pipe(
      map(response => response.body),
      tap(answers => this.navService.activeAssessmentSessionId$.next(answers.session_id)),
      tap(_ => this.markAsNASub = null),
      tap(_ => this.markAsDoneSub = null),
      tap(_ => this.answersLoading = false)
    );

    this.isSectionReady$ = combineLatest(this.questions$, this.answers$).pipe(
      map(([questions, answers]) => !(questions.filter(q => !answers.answers[q.id] || answers.answers[q.id].answer === null).length))
    );
  }

  ngOnDestroy() {
    this.resetSelectAllSub.unsubscribe();
    this.isDestroyed = true;
  }

  setAnswer(q: AssessmentQuestion, t: AssessmentType, answer: boolean | null) {
    delete this.errors[q.id];
    this.asmService.saveAnswer(q, t, this.navService.lastOrganization.current, answer).subscribe(_ => this.answerUpdated$.next(true));
  }

  answerAll(g: AssessmentGroup, t: AssessmentType, answer: boolean) {
    this.asmService.answerAll(g, t, this.navService.lastOrganization.current, answer).subscribe(_ => this.answerUpdated$.next(true));
  }

  clearAll(g: AssessmentGroup, t: AssessmentType, clear: 'answers' | 'notes') {
    if (confirm('Really clear all ' + clear + ' in ' + g.name + '?')) {
      const sub = clear === 'notes' ? 'clearNotesSub' : 'clearAnswersSub';
      this[sub] = this.asmService.answerAll(g, t, this.navService.lastOrganization.current, null, clear).subscribe(_ => {
        this.answerUpdated$.next(true);
        this.toastr.success(g.name + ' answers have been cleared');
      });
    }
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
    if (this.markAsDoneSub && !this.markAsDoneSub.closed) {
      return;
    }

    if (!answers.isNA) {
      this.errors = questions
        .filter(q => !answers.answers[q.id] || answers.answers[q.id].answer === null)
        .reduce((errors, q) => {
          errors[q.id] = true;
          return errors;
        }, {});
    }

    if (Object.values(this.errors).length) {
      return;
    }

    this.markAsDoneSub = this.asmService.markAsDone(activeGroup, t, this.navService.lastOrganization.current)
      .subscribe(_ => this.toastr.success(activeGroup.name + ' has been marked as done'));
  }

  markAsNA(activeGroup: AssessmentGroup, t: AssessmentType, moveToNextStep: boolean) {
    if (this.markAsNASub && !this.markAsNASub.closed) {
      return;
    }

    this.markAsNASub = this.asmService.markAsNotApplicable(activeGroup, t, this.navService.lastOrganization.current, moveToNextStep)
      .subscribe(_ => {
        this.toastr.success(activeGroup.name + ' has been ' + (moveToNextStep ? '' : 'un') + 'marked as Not Applicable');

        if (!moveToNextStep) {
          this.answerUpdated$.next(true);
        }
      });
  }
}
