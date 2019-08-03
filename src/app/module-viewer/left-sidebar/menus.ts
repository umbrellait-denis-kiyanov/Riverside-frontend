import User from '../../common/interfaces/user.model';
import { RequestFeedbackComponent } from '../request-feedback/request-feedback.component';

export const menus = [
  {
    render(user: User) {
      return `<img
        src=${user.email === 'dan@riverside.com' ? 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dan+-+Riverside.jpg' : 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dave+-+Alice.png'}
        style="width: 25px; height: 25px; border-radius: 25px">`;
    },
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
    'mat-icon': 'feedback',
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
