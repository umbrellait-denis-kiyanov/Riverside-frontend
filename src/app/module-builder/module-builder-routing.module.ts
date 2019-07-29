import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';

import { ModuleEditorComponent } from './module-editor/module-editor.component';
import { MatcherComponent } from './matcher/matcher.component';
import { ModuleSelectorComponent } from './module-selector/module-selector.component';
import { MainComponent } from '../module-viewer/main/main.component';




const routes: Routes = [
  {
    path: 'builder',
    component: MainComponent,
    children: [
      {
        path: '',
        component: ModuleSelectorComponent,
        children: [
          {
            path: ':id',
            component: ModuleEditorComponent
          }
        ]
      }
    ]
  },


];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: true, urlUpdateStrategy: 'deferred'})],
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
