import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AssessmentType, AssessmentGroup } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.sass']
})
export class AssessmentMenuComponent implements OnInit {

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  activeType$: BehaviorSubject<AssessmentType>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    this.activeType$ = this.navService.assesmentType.onChange;
    this.activeType$.next(this.navService.assesmentType.current);

    this.groups$ = this.activeType$.pipe(
      mergeMap((type: AssessmentType) => this.asmService.getGroups(type)));

    this.activeGroup$ = this.navService.assessmentGroup$;
  }

  setType(type: AssessmentType) {
    this.navService.assesmentType.current = type;
  }

  setGroup(group: AssessmentGroup) {
    this.navService.assessmentGroup$.next(group);
  }
}
