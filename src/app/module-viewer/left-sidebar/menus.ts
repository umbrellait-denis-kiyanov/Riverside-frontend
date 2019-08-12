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

// For SUPER temporary use
const hardCodePictures = (user: User) => {
  switch (user.email) {
    case 'dan@riverside.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dan+-+Riverside.jpg';
    case 'dave@alice.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dave+-+Alice.png';
    case 'don.flake@english3.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/donflake.jpg';
    case 'moroni.flake@english3.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/moroniflake.jpg';
    default:
    return '';
  }
};

export const menus: MenusInterface = [
  {
    render(user: User) {
      return `<img
        src=${hardCodePictures(user)}
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
    labelFn: ({nav}) => nav.module.current.name.toUpperCase(),
    linkFn(nav: ModuleNavService) {
      const module = nav.module.current;
      const stepId = module.steps[module.steps.length - 1].id;
      return `/module/${module.id}/step/${stepId}`;
    }
  },
];
