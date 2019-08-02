import User from '../../common/interfaces/user.model';
import { RequestFeedbackComponent } from '../request-feedback/request-feedback.component';

export const menus = [
  {
    'mat-icon': 'account_circle',
    label: 'ACCOUNT',
    link: '/account',
  },
  {
    'mat-icon': 'view_module',
    label: 'MODULE',
    link: '/module/1',
  },
  {
    'mat-icon': 'build',
    label: 'EDITOR',
    link: '/builder',
    restrict: (user: User) => user.roles.super_admin
  },

  {
    'mat-icon': 'feedback_outlined',
    className: 'material-icons-outlined',
    label: 'FEEDBACK',
    modalComponent: RequestFeedbackComponent,
    restrict: (user: User) => !user.roles.riverside_se
  },
  {
    'mat-icon': 'email',
    className: 'material-icons-outlined',
    label: 'INBOX',
    link: '/inbox',
    counter: 0
  },
];
