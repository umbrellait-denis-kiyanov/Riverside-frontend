import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { TemplateContentData } from 'src/app/common/components/riverside-step-template/templates/template-data.class';
import { RiversideStepTemplateComponent } from 'src/app/common/components/riverside-step-template/riverside-step-template.component';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { first, filter } from 'rxjs/operators';


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
  @ViewChild(RiversideStepTemplateComponent) templateComponent: RiversideStepTemplateComponent;

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private userService: UserService,
    private moduleContentService: ModuleContentService
  ) { }

  ngOnInit() {

    this.me = this.userService.me;
    this.moduleContentService.load({
      moduleId: 1,
      stepId: 50,
      org_id: this.me.org.id
    });
    this.moduleContentService.moduleContent.ready.pipe(filter(v => v)).pipe(first()).subscribe(this.render.bind(this));
    this.module = this.moduleService.module;
    if (Array.isArray(this.module)) {
      return;
    }
    this.route.params.subscribe(params => {
      console.log('oi', params);
    });
    this.route.queryParams.subscribe(params => {
      if (params.step) {
        const step = this.module.steps[Number(params.step)];
        if (step && step.google_doc_url) {
          this.iframeUrl = step.google_doc_url;
          return;
        }
      }

      this.iframeUrl = this.module.google_doc_url;
      this.ready = true;
    });

  }

  render() {
    this.processFeedbackStatus();
    const {moduleContent: {data: {content_json: data, inputs}}} =  this.moduleContentService;
    const templateData = {
      ...data,
      inputs,
      disabled: this.disableInputs
    };
    this.templateData = new TemplateContentData({data: templateData, me: this.me});

  }

  processFeedbackStatus() {
    const {moduleContent: {data: { feedback_requested, feedback_started }}} = this.moduleContentService;
    const { roles: {riverside_se }} = this.me;
    feedback_requested && !feedback_started && riverside_se && this.moduleService.feedbackStarted({id: 1});
    this.disableInputs = !riverside_se && feedback_started;
    this.showFinishFeedback = riverside_se && feedback_requested;
  }

  toggleChanges() {
    this.templateData.hideChanges = !this.templateData.hideChanges;
  }

  save() {
    const {moduleContent: {data}} =  this.moduleContentService;
    const templateData = this.templateComponent.prepareData();
    data.content_json =  templateData;
    data.inputs = templateData.inputs;
    this.moduleContentService.save(data);
  }

  requestFeedback() {
    this.moduleService.requestFeedback({id: 1 });
  }

  finishFeedback() {
    this.moduleService.finalizeFeedback({id: 1 });
  }
}

