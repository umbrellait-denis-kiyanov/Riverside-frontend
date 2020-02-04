import { Component, OnInit, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { CampaignCalendarTemplateData, TemplateParams } from '.';
import { TemplateInput } from 'src/app/common/interfaces/module.interface';
import { Campaign } from './campaign-calendar';

@Component({
  selector: 'app-campaign-calendar-template',
  templateUrl: './campaign-calendar-template.component.html',
  styleUrls: ['./campaign-calendar-template.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => CampaignCalendarTemplateComponent) }]
})
export class CampaignCalendarTemplateComponent extends TemplateComponent {

  params = TemplateParams;

  contentData: CampaignCalendarTemplateData['template_params_json'];

  input: TemplateInput;

  campaigns: Campaign[];

  getDescription() {
    return '';
  }

  getName() {
    return 'Campaign Calendar';
  }

  init() {
    this.campaigns = JSON.parse(this.getInput('campaign_calendar_1').getValue() || '[]') as Campaign[];
  }
}
