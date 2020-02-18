import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  Module,
  Organization
} from "src/app/common/interfaces/module.interface";
import { ModuleService } from "src/app/common/services/module.service";
import { NgbDateStruct, NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-due-date",
  exportAs: "dueDate",
  templateUrl: "./due-date.component.html",
  styleUrls: ["./due-date.component.sass"]
})
export class DueDateComponent implements OnInit {
  @Input()
  module: Module;

  @Input()
  organization: Organization;

  @ViewChild("d") ngbDatepicker: NgbInputDatepicker;

  minDate: NgbDateStruct;

  constructor(private moduleService: ModuleService) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  }

  saveDueDate(module: Module) {
    this.moduleService
      .setDueDate(module, module.status.due_date, this.organization.id)
      .subscribe(newStatus => {
        module.status = newStatus;
      });
  }

  toggle(e) {
    this.ngbDatepicker.toggle();
  }
}
