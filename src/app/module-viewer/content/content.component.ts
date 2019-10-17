import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { TemplateContentData } from 'src/app/module-viewer/riverside-step-template/templates/template-data.class';
import { RiversideStepTemplateComponent } from 'src/app/module-viewer/riverside-step-template/riverside-step-template.component';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { first, filter, debounceTime, skip, take } from 'rxjs/operators';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { combineLatest, Subscription, forkJoin, merge } from 'rxjs';
import { Templates } from '../riverside-step-template/templates';
import { IceService } from '../ice/ice.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit, OnDestroy {
  iframeUrl: string;
  module: Module;
  ready = false;
  me: User;
  showChanges: boolean;
  templateData: TemplateContentData;
  templateComponentName: keyof typeof Templates;
  disableInputs: boolean = false;
  showFinishFeedback: boolean = false;
  stepId: number;
  orgId: number;
  moduleId: number;
  unsubNavChanged: Subscription;
  unsubOnApprove: Subscription;
  unsubContentChange: Subscription;
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
    this.unsubNavChanged && this.unsubNavChanged.unsubscribe();
    this.unsubContentChange && this.unsubContentChange.unsubscribe();
    this.unsubOnApprove && this.unsubOnApprove.unsubscribe();
  }

  async ngOnInit() {
    this.unsubNavChanged && this.unsubNavChanged.unsubscribe();
    this.unsubOnApprove && this.unsubOnApprove.unsubscribe();
    this.unsubNavChanged = this.router.events
      .pipe(
          filter(e => e instanceof NavigationEnd),
        )
      .subscribe(e => {
        this.ready = false;
        this.templateData = null;
        this.init();
      });
    this.init();
  }

  async init() {
    this.me = this.userService.me;
    await Promise.all([this.waitForParams(), this.waitForModule()]);

    this.moduleContentService
      .load({
        moduleId: this.navService.module.current.id,
        stepId: this.stepId,
        org_id: this.orgId
      })
      .then(_ => {
        if (this.moduleContentService.moduleContent.error) {
          const firstStep = this.navService.module.current.steps.find(step => !step.is_section_break).id;
          this.router.navigate(['org', this.orgId, 'module', this.navService.module.current.id, 'step', firstStep]);
        } else {
          this.render();
        }
      });
  }

  async waitForParams() {
    return new Promise(resolve => {
      combineLatest(this.route.params, this.route.parent.params).subscribe(
        ([params, parentParams]) => {
          this.stepId = params.stepId;
          this.orgId = parentParams.orgId || this.me.org.id;
          this.navService.setStepFromId(this.stepId);
          resolve();
        }
      );
    });
  }

  async waitForModule() {
    return new Promise(resolve => {
      this.navService.module.onChange
        .pipe(filter(v => v !== null))
        .subscribe(() => {
          this.moduleId = this.navService.module.current.id;
          resolve();
        });
    });
  }

  render() {
    this.ready = true;
    this.navService.setStepFromId(this.stepId);
    this.processFeedbackStatus();
    this.unsubContentChange && this.unsubContentChange.unsubscribe();
    this.unsubContentChange = this.moduleContentService.contentChanged
      .pipe(
        skip(1),
        debounceTime(this.debounceSaveTime)
      )
      .subscribe(this.save.bind(this));
    const {
      moduleContent: {
        data: {
          content_json: data,
          inputs,
          template_params_json,
          template_component,
          can_modify,
          is_approved
        }
      }
    } = this.moduleContentService;

    this.canModify = can_modify;

    is_approved &&
      !this.userService.me.permissions.riversideRequestFeedback &&
      (this.iceService.shouldShowWarning = true);
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
    // this.unsubOnApprove = this.navService.onApprove.pipe(debounceTime(100)).subscribe(val => {
    //   this.iceService.onApprove.emit(val);
    //   if (!this.iceService.allComponents.length) {
    //     this.navService.nextStep();
    //   } else {
    //     this.moduleContentService.contentChanged.pipe(take(1)).subscribe(() => {
    //       if (!this.moduleContentService.moduleContent.data.requires_feedback) {
    //         this.navService.onSave.pipe(take(1)).subscribe(() => {
    //           this.navService.nextStep();
    //         });
    //       }

    //     });
    //   }
    // });
  }

  processFeedbackStatus() {
    const {
      moduleContent: {
        data: { feedback_requested, feedback_started }
      }
    } = this.moduleContentService;
    const is_riverside_managing_director = this.me.permissions.riversideProvideFeedback;
    feedback_requested &&
      !feedback_started &&
      is_riverside_managing_director &&
      this.moduleService.feedbackStarted({ id: 1 });
    this.disableInputs = !is_riverside_managing_director && feedback_started;
    this.showFinishFeedback =
      is_riverside_managing_director && feedback_requested;
  }

  toggleChanges() {
    this.templateData.hideChanges = !this.templateData.hideChanges;
  }

  save() {
    const {
      moduleContent: { data }
    } = this.moduleContentService;
    const templateData = this.templateComponent.prepareData();
    data.content_json = templateData;
    data.inputs = this.addIdsToInputs(templateData.inputs);
    delete data.is_approved;
    this.moduleContentService.save(data).then(() => {
      this.navService.onSave.emit();
    });
  }

  addIdsToInputs(inputs: any) {
    Object.keys(inputs).forEach(k => {
      inputs[k].org_id = inputs[k].org_id || this.orgId;
      inputs[k].module_id = inputs[k].module_id || this.moduleId;
    });
    return inputs;
  }

  requestFeedback() {
    this.moduleService.requestFeedback({ id: 1 });
  }

  finishFeedback() {
    this.moduleService.finalizeFeedback({ id: 1 });
  }
}
