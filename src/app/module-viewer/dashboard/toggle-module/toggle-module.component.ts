import { Component, OnInit, Input } from "@angular/core";
import {
  Module,
  Organization
} from "src/app/common/interfaces/module.interface";
import { ModuleService } from "src/app/common/services/module.service";

@Component({
  selector: "app-toggle-module",
  templateUrl: "./toggle-module.component.html",
  styleUrls: ["./toggle-module.component.sass"]
})
export class ToggleModuleComponent implements OnInit {
  @Input()
  module: Module;

  @Input()
  organization: Organization;

  constructor(private moduleService: ModuleService) {}

  ngOnInit() {}

  toggleModuleStatus(module: Module) {
    const status = module.status ? !module.status.is_activated : true;

    this.moduleService
      .setStatus(module, status, this.organization.id)
      .subscribe(newStatus => {
        module.status = newStatus;
      });
  }
}
