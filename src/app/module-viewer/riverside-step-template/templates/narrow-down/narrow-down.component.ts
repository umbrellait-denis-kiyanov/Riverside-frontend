import { Component, forwardRef } from "@angular/core";

import { TemplateComponent } from "../template-base.class";
import BuyerPersonasConfigTemplateComponent from "../buyer-personas-config-template-component";
import { NarrowDownData } from ".";
import txt from "!!raw-loader!./index.ts";

@Component({
  selector: "app-template2",
  templateUrl: "./narrow-down.component.html",
  styleUrls: ["./narrow-down.component.sass"],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => NarrowDownComponent)
    }
  ]
})
export class NarrowDownComponent extends BuyerPersonasConfigTemplateComponent {
  inputIds = {
    fromPreviousStep: ["brainstorm_personas"],
    personas: [
      "persona_1",
      "persona_2",
      "persona_3",
      "persona_4",
      "persona_5",
      "persona_6"
    ]
  };
  params = txt;

  contentData: NarrowDownData["template_params_json"];

  getDescription() {
    return "";
  }

  getName() {
    return "Narrow Down";
  }

  protected init() {
    super.init();
    this.contentData = this.data.data
      .template_params_json as NarrowDownData["template_params_json"];
  }
}
