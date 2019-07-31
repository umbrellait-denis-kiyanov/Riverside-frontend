import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { MainComponent } from './main/main.component';
import { ContentComponent } from './content/content.component';
import { InboxComponent } from './inbox/inbox.component';
import { LeftMenuComponent } from './left-menu/module/module-left-menu.component';
import { InboxLeftMenuComponent } from './left-menu/inbox/inbox-left-menu.component';
import { AccountLeftMenuComponent } from './left-menu/account/account-left-menu.component';




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
        path: 'step/:stepId',
        component: ContentComponent
      },
      {
        path: '',
        component: LeftMenuComponent,
        outlet: 'left-menu'
      }
    ]
  },
  {
    path: 'inbox',
    component: MainComponent,
    children: [
      {
        path: '',
        component: InboxComponent
      },
      {
        path: ':id',
        component: InboxComponent
      },
      {
        path: '',
        component: InboxLeftMenuComponent,
        outlet: 'left-menu'
      },
    ]
  },
  {
    path: 'account',
    component: MainComponent,
    children: [
      {
        path: '',
        component: InboxComponent
      },
      {
        path: '',
        component: AccountLeftMenuComponent,
        outlet: 'left-menu'
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
