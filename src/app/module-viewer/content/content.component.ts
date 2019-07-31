import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { TemplateContentData } from 'src/app/module-viewer/riverside-step-template/templates/template-data.class';
import { RiversideStepTemplateComponent } from 'src/app/module-viewer/riverside-step-template/riverside-step-template.component';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { first, filter } from 'rxjs/operators';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {
  iframeUrl: string;
  module: Module;
  ready = false;
  me: User;
  showChanges: boolean;
  templateData: TemplateContentData;
  disableInputs: boolean = false;
  showFinishFeedback: boolean = false;
  stepId: number;
  @ViewChild(RiversideStepTemplateComponent) templateComponent: RiversideStepTemplateComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moduleService: ModuleService,
    private userService: UserService,
    private moduleContentService: ModuleContentService,
    private navService: ModuleNavService
  ) { }

  async ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.ready = false;
      this.templateData = null;
      this.init();
    });
    this.init();

  }

  async init() {
    this.me = this.userService.me;
    await Promise.all([this.waitForParams(), this.waitForModule()]);

    this.moduleContentService.load({
      moduleId: this.navService.module.current.id,
      stepId: this.stepId,
      org_id: this.me.org.id
    }).then(this.render.bind(this));
    // this.moduleContentService.moduleContent.ready
    //   .pipe(filter(v => v))
    //   .subscribe(this.render.bind(this));
  }

  async waitForParams() {
    return new Promise(resolve => {
      this.route.params.subscribe(params => {
        this.stepId = params.stepId;
        resolve();
      });
    });

  }

  async waitForModule() {
    return new Promise(resolve => {
      this.navService.module.onChange.pipe(filter(v => v !== null)).subscribe(() => {
        resolve();
      });
    });
  }

  render() {
    this.ready = true;
    this.navService.setStepFromId(this.stepId);
    this.processFeedbackStatus();
    const { moduleContent: { data: { content_json: data, inputs, template_params_json } } } = this.moduleContentService;
    const templateData = {
      ...data,
      inputs,
      template_params_json,
      disabled: this.disableInputs
    };
    this.templateData = new TemplateContentData({ data: templateData, me: this.me });

  }

  processFeedbackStatus() {
    const { moduleContent: { data: { feedback_requested, feedback_started } } } = this.moduleContentService;
    const { roles: { riverside_se } } = this.me;
    feedback_requested && !feedback_started && riverside_se && this.moduleService.feedbackStarted({ id: 1 });
    this.disableInputs = !riverside_se && feedback_started;
    this.showFinishFeedback = riverside_se && feedback_requested;
  }

  toggleChanges() {
    this.templateData.hideChanges = !this.templateData.hideChanges;
  }

  save() {
    const { moduleContent: { data } } = this.moduleContentService;
    const templateData = this.templateComponent.prepareData();
    // data.content_json = templateData;
    data.inputs = templateData.inputs;
    this.moduleContentService.save(data);
  }

  requestFeedback() {
    this.moduleService.requestFeedback({ id: 1 });
  }

  finishFeedback() {
    this.moduleService.finalizeFeedback({ id: 1 });
  }
}

