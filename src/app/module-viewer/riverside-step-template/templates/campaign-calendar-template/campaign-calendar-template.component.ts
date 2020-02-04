import { Component, OnInit, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { CampaignCalendarTemplateData, TemplateParams } from '.';

@Component({
  selector: 'app-campaign-calendar-template',
  templateUrl: './campaign-calendar-template.component.html',
  styleUrls: ['./campaign-calendar-template.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => CampaignCalendarTemplateComponent) }]
})
export class CampaignCalendarTemplateComponent extends TemplateComponent {

  params = TemplateParams;

  contentData: CampaignCalendarTemplateData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Campaign Calendar';
  }


}
