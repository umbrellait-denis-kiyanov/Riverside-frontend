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
import { DashboardComponent } from './dashboard/dashboard.component';
import { MasterDashboardComponent } from './master-dashboard/master-dashboard.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentMenuComponent } from './left-menu/assessment-menu/assessment-menu.component';

const moduleContentRoute = [
  {
    path: 'step/:stepId',
    component: ContentComponent
  },
  {
    path: '',
    component: LeftMenuComponent,
    outlet: 'left-menu'
  }
];

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'module/1/step/1'
  },
  {
    path: 'org/:orgId/module/:moduleId',
    component: MainComponent,
    children: moduleContentRoute
  },
  {
    path: 'module/:moduleId',
    component: MainComponent,
    children: moduleContentRoute
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
  {
    path: 'dashboard/:orgId',
    component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: '',
        component: LeftMenuComponent,
        outlet: 'left-menu'
      }
    ]
  },
  {
    path: 'master-dashboard',
    component: MainComponent,
    children: [
      {
        path: '',
        component: MasterDashboardComponent
      },
      {
        path: '',
        component: LeftMenuComponent,
        outlet: 'left-menu'
      }
    ]
  },
  {
    path: 'assessment',
    component: MainComponent,
    children: [
      {
        path: '',
        component: AssessmentComponent
      },
      {
        path: '',
        component: AssessmentMenuComponent,
        outlet: 'left-menu'
      }
    ]
  }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: true, urlUpdateStrategy: 'deferred'})],
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
