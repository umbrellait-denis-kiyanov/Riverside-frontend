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
import { AssessmentFinishComponent } from './assessment/assessment-finish/assessment-finish.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { CampaignCalendarComponent } from './campaign-calendar/campaign-calendar.component';

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
    path: 'calendar',
    component: CampaignCalendarComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
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
        redirectTo: 'profile', pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'password',
        component: ChangePasswordComponent
      },
      {
        path: '',
        component: AccountLeftMenuComponent,
        outlet: 'left-menu'
      }
    ]
  },
  {
    path: 'dashboard',
    component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
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
      }
    ]
  },
  {
    path: 'org/:orgId/assessment',
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
      },
      {
        path: 'finish',
        component: AssessmentFinishComponent
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
