import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { MainComponent } from './main/main.component';
import { ContentComponent } from './content/content.component';




const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'module/1'
  },
  {
    path: 'module/:moduleId',
    component: MainComponent,
    children: [
      {
        path: '',
        component: ContentComponent
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
