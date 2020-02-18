import { Component, forwardRef } from "@angular/core";
import { TemplateComponent } from "../template-base.class";
import { CampaignCalendarTemplateData, TemplateParams } from ".";
import { Campaign } from "./campaign-calendar";

@Component({
  selector: "app-campaign-calendar-template",
  templateUrl: "./campaign-calendar-template.component.html",
  styleUrls: ["./campaign-calendar-template.component.sass"],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => CampaignCalendarTemplateComponent)
    }
  ]
})
export class CampaignCalendarTemplateComponent extends TemplateComponent {
  params = TemplateParams;

  contentData: CampaignCalendarTemplateData["template_params_json"];

  get input() {
    return this.getInput("campaign_calendar_1");
  }

  set campaigns(campaigns: Campaign[]) {
    this.input.content = JSON.stringify(campaigns);
    this.contentChanged(this.input);
  }

  get campaigns() {
    return JSON.parse(this.input.getValue() || "[]") as Campaign[];
  }

  getDescription() {
    return "";
  }

  getName() {
    return "Campaign Calendar";
  }
}
