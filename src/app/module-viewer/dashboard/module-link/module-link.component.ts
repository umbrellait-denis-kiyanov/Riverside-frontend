import { Component, OnInit, Input } from "@angular/core";
import { Module } from "src/app/common/interfaces/module.interface";
import { ModuleNavService } from "src/app/common/services/module-nav.service";

@Component({
  selector: "app-module-link",
  templateUrl: "./module-link.component.html",
  styleUrls: ["./module-link.component.sass"]
})
export class ModuleLinkComponent implements OnInit {
  @Input()
  module: Module;

  underConstruction = false;

  orgId: number;

  constructor(private moduleNavService: ModuleNavService) {}

  ngOnInit() {
    this.moduleNavService.organization$.subscribe(
      orgId => (this.orgId = orgId)
    );
  }

  showUnderConstructionMessage(module: Module) {
    this.underConstruction = true;

    setTimeout(() => (this.underConstruction = false), 3000);
  }
}
