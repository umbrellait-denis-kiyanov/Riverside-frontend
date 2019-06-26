import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { MainComponent } from './main/main.component';
import { ModuleEditorComponent } from './module-editor/module-editor.component';
import { MatcherComponent } from './matcher/matcher.component';
import { ModuleSelectorComponent } from './module-selector/module-selector.component';




const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'builder'
      },
      {
        path: 'builder',
        component: ModuleSelectorComponent,
        children: [
          {
            path: ':id',
            component: ModuleEditorComponent
          }
        ]
      },
      {
        path: 'matcher',
        component: MatcherComponent
      },

    ]
  },



];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: true, urlUpdateStrategy: 'deferred'})],
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
