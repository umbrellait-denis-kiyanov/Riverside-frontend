import User from '../../common/interfaces/user.model';
import { RequestFeedbackComponent } from '../request-feedback/request-feedback.component';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { feedback_svg } from './feedback.icon';
import { review_svg } from './review.icon';
interface RestrictOptions {
  nav: ModuleNavService;
  user: User;
}
interface MenuItemType {
  [key: string]: any;
  restrict?(params: Partial<RestrictOptions>): boolean;
}
type MenusInterface = MenuItemType[];
export const menus: MenusInterface = [
  {
    render(user: User) {
      return `<img
        src=${user.email === 'dan@riverside.com' ?
          'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dan+-+Riverside.jpg' :
          'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dave+-+Alice.png'
        }
        style="width: 35px; height: 35px; border-radius: 35px">`;
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
    restrict: ({ user }) => user.roles.super_admin
  },

  {
    render: () => feedback_svg,
    label: 'FEEDBACK',
    modalComponent: RequestFeedbackComponent,
    restrict: ({ user }) => !user.roles.riverside_se
  },
  {
    'mat-icon': 'email',
    className: 'material-icons-outlined',
    label: 'INBOX',
    link: '/inbox',
    counter: 0
  },

  {
    render: () => review_svg,
    restrict: ({nav}) => !!nav.module.current,
    className: 'material-icons-outlined',
    labelFn: ({nav}) => (nav.module.current || {name: ''}).name.toUpperCase(),
    linkFn(nav: ModuleNavService) {
      const module = nav.module.current;
      const stepId = module.steps[module.steps.length - 1].id;
      return `/module/${module.id}/step/${stepId}`;
    }
  },
];
