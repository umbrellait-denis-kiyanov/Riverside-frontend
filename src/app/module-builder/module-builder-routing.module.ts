import { NgModule, Injectable } from "@angular/core";
import { RouterModule, Routes, CanDeactivate } from "@angular/router";

import { ModuleEditorComponent } from "./module-editor/module-editor.component";
import { ModuleSelectorComponent } from "./module-selector/module-selector.component";
import { MainComponent } from "../module-viewer/main/main.component";

@Injectable()
class ConfirmDeactivateGuard implements CanDeactivate<ModuleEditorComponent> {
  canDeactivate(target: ModuleEditorComponent) {
    if (target.hasChanges && target.hasChanges()) {
      return window.confirm(
        "Leaving the module builder will discard any unsaved changes. Are you sure?"
      );
    }
    return true;
  }
}

const routes: Routes = [
  {
    path: "builder",
    canDeactivate: [ConfirmDeactivateGuard],
    component: MainComponent,
    children: [
      {
        path: "",
        component: ModuleSelectorComponent,
        children: [
          {
            path: ":id",
            canDeactivate: [ConfirmDeactivateGuard],
            component: ModuleEditorComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: true, urlUpdateStrategy: 'deferred'})],
  imports: [RouterModule.forChild(routes)],
  providers: [ConfirmDeactivateGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {}
