import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { TemplateContentData } from 'src/app/module-viewer/riverside-step-template/templates/template-data.class';
import { RiversideStepTemplateComponent } from 'src/app/module-viewer/riverside-step-template/riverside-step-template.component';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { first, filter, debounceTime, skip, take, switchMap, map } from 'rxjs/operators';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { combineLatest, Subscription, forkJoin, merge } from 'rxjs';
import { Templates } from '../riverside-step-template/templates';
import { IceService } from '../ice/ice.service';
import ModuleContent from 'src/app/common/interfaces/module-content.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit, OnDestroy {
  iframeUrl: string;
  module: Module;
  me: User;
  showChanges: boolean;
  templateData: TemplateContentData;
  templateComponentName: keyof typeof Templates;
  disableInputs: boolean = false;
  showFinishFeedback: boolean = false;
  stepId: number;
  orgId: number;
  moduleId: number;
  unsubOnApprove: Subscription;
  debounceSaveTime = 500;
  canModify = false;

  @ViewChild(RiversideStepTemplateComponent)
  templateComponent: RiversideStepTemplateComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moduleService: ModuleService,
    private userService: UserService,
    private moduleContentService: ModuleContentService,
    private navService: ModuleNavService,
    private iceService: IceService
  ) {}

  async ngOnDestroy() {
    this.unsubOnApprove && this.unsubOnApprove.unsubscribe();
  }

  async ngOnInit() {
    this.me = this.userService.me;

    combineLatest(this.route.params, this.route.parent.params).subscribe(
      ([params, parentParams]) => {

        // todo: remove from here?
        this.navService.lastOrganization.current = Number(parentParams.orgId);
        this.navService.module.current = Number(parentParams.moduleId);

        this.navService.step.current = Number(params.stepId);
      }
    );

    combineLatest(this.navService.organization$, this.navService.module$, this.navService.step$).subscribe(console.log);

    combineLatest(this.navService.organization$, this.navService.module$, this.navService.step$)
      .pipe(
        switchMap(([org, module, step]) => this.moduleContentService.load(module, step, org))
      )
      .subscribe(moduleContent => this.render(moduleContent));

      // if (this.moduleContentService.moduleContent.error) {
      //   const firstStep = this.navService.module.current.steps.find(step => !step.is_section_break).id;
      //   this.router.navigate(['org', this.orgId, 'module', this.navService.module.current.id, 'step', firstStep]);
      // } else {
      //   this.render();
      // }
  }

  render(moduleContent: ModuleContent) {
    console.log(moduleContent);

    const { feedback_requested, feedback_started } = moduleContent;
    const is_riverside_managing_director = this.me.roles.is_riverside_managing_director;

    if (feedback_requested && !feedback_started && is_riverside_managing_director) {
      this.moduleService.feedbackStarted({ id: moduleContent.module_id });
    }

    this.disableInputs = !is_riverside_managing_director && feedback_started;
    this.showFinishFeedback = is_riverside_managing_director && feedback_requested;

    const {
        content_json: data,
        inputs,
        template_params_json,
        template_component,
        can_modify,
        is_approved
    } = moduleContent;

    Object.keys(inputs).forEach(k => {
      inputs[k].org_id = inputs[k].org_id || moduleContent.org_id;
      inputs[k].module_id = inputs[k].module_id || moduleContent.module_id;
    });

    // console.log(inputs);

    this.canModify = can_modify;

    this.iceService.shouldShowWarning = is_approved && !this.userService.me.roles.is_riverside_managing_director;

    const templateData = {
      ...data,
      inputs,
      template_params_json,
      canModify: can_modify,
      disabled: this.disableInputs || !can_modify
    };

    this.templateData = new TemplateContentData({
      data: templateData,
      me: this.me,
      canModify: can_modify
    });

    this.templateComponentName = template_component as keyof typeof Templates;
    this.unsubOnApprove && this.unsubOnApprove.unsubscribe();
  }

  toggleChanges() {
    this.templateData.hideChanges = !this.templateData.hideChanges;
  }
}
