import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { TemplateContentData } from 'src/app/module-viewer/riverside-step-template/templates/template-data.class';
import { RiversideStepTemplateComponent } from 'src/app/module-viewer/riverside-step-template/riverside-step-template.component';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { switchMap, catchError, filter, tap, map } from 'rxjs/operators';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { combineLatest, Subscription, Observable, race } from 'rxjs';
import { Templates } from '../riverside-step-template/templates';
import { IceService } from '../ice/ice.service';
import ModuleContent from 'src/app/common/interfaces/module-content.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit, OnDestroy {
  me: User;
  templateData: TemplateContentData;
  templateComponentName: keyof typeof Templates;
  canModify = false;

  routeWatch: Subscription;

  moduleContent$: Observable<any>;

  @ViewChild(RiversideStepTemplateComponent)
  templateComponent: RiversideStepTemplateComponent;

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private userService: UserService,
    private moduleContentService: ModuleContentService,
    private navService: ModuleNavService,
    private iceService: IceService
  ) {}

  ngOnDestroy() {
    this.routeWatch.unsubscribe();
  }

  ngOnInit() {
    this.me = this.userService.me;

    this.routeWatch = this.route.params.pipe(filter(params => params.stepId)).subscribe(
      params => this.navService.step.current = Number(params.stepId)
    );

    this.moduleContent$ = combineLatest(this.navService.organization$, this.navService.module$, this.navService.step$)
      .pipe(
        switchMap(([org, module, step]) => this.moduleContentService.load(module, step, org).pipe(
          catchError(_ => this.navService.moduleData$.pipe(
            switchMap(moduleData => {
              const firstStep = moduleData.steps.find(stepData => !stepData.is_section_break).id;
              this.navService.goToStep(firstStep);
              return this.moduleContentService.load(moduleData.id, firstStep, org);
            })
          ))
        )),
        tap(this.render.bind(this))
      );
  }

  render(moduleContent: ModuleContent) {
    const { feedback_requested, feedback_started, can_modify } = moduleContent;
    const is_riverside_managing_director = this.me.permissions.riversideProvideFeedback;

    if (feedback_requested && !feedback_started && is_riverside_managing_director) {
      this.moduleService.feedbackStarted({ id: moduleContent.module_id }).subscribe();
    }

    this.canModify = can_modify;

    this.iceService.shouldShowWarning = moduleContent.is_approved && !is_riverside_managing_director;

    moduleContent.disabled = (!is_riverside_managing_director && feedback_started) || !can_modify;

    this.templateData = new TemplateContentData({
      data: moduleContent,
      me: this.me,
      canModify: can_modify
    });

    this.templateComponentName = moduleContent.template_component as keyof typeof Templates;

    window.scrollTo(0, 0);
  }
}
