import { Component, forwardRef } from "@angular/core";

import { TemplateComponent } from "../template-base.class";
import { GenericTemplateData } from ".";
import txt from "!!raw-loader!./index.ts";

@Component({
  selector: "app-generic",
  templateUrl: "./generic.component.html",
  styleUrls: ["./generic.component.sass"],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => GenericTemplateComponent)
    }
  ]
})
export class GenericTemplateComponent extends TemplateComponent {
  contentData: GenericTemplateData["template_params_json"];
  params = txt;

  embedUrl: string;

  protected init() {
    this.contentData = this.data.data
      .template_params_json as GenericTemplateData["template_params_json"];

    this.embedUrl = this.contentData.imageUrl;
  }

  getDescription() {
    return "";
  }

  getName() {
    return "Generic Content";
  }

  hasInputs() {
    return false;
  }
}
