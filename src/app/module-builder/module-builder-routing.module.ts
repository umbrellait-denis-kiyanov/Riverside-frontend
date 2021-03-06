import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes, CanDeactivate } from '@angular/router';

import { ModuleEditorComponent } from './module-editor/module-editor.component';
import { ModuleSelectorComponent } from './module-selector/module-selector.component';
import { MainComponent } from '../module-viewer/main/main.component';

@Injectable()
export class ConfirmExitGuard implements CanDeactivate<ModuleEditorComponent> {
  canDeactivate(target: ModuleEditorComponent) {
    if (target.hasChanges && target.hasChanges()) {
      return window.confirm(
        'Leaving the module builder will discard any unsaved changes. Are you sure?'
      );
    }

    return true;
  }
}

const routes: Routes = [
  {
    path: 'builder',
    canDeactivate: [ConfirmExitGuard],
    component: MainComponent,
    children: [
      {
        path: '',
        component: ModuleSelectorComponent,
        children: [
          {
            path: ':id',
            canDeactivate: [ConfirmExitGuard],
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
  providers: [ConfirmExitGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {}
