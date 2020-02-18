import { Component, forwardRef, Input } from "@angular/core";
import { FinalFeedbackComponent } from "../final-feedback.component";
import { TemplateComponent } from "../../template-base.class";

@Component({
  selector: "app-final-feedback-tabs",
  templateUrl: "./final-feedback-tabs.component.html",
  styleUrls: ["./final-feedback-tabs.component.sass"],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => FinalFeedbackTabsComponent)
    }
  ]
})
export class FinalFeedbackTabsComponent extends FinalFeedbackComponent {
  @Input() inputIds;
  @Input() columnBoxes;
  @Input() inputs;
  @Input() data;
}
