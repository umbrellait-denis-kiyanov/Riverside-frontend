import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "error-msg",
  templateUrl: "./error-msg.component.html",
  styleUrls: ["./error-msg.component.sass"]
})
export class ErrorMsgComponent implements OnInit {
  @Input() input: Partial<{ error: Observable<string> }>;

  constructor() {}

  ngOnInit() {}
}
