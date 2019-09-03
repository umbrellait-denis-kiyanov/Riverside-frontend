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
    case 'dperry@riversidecompany.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dan+-+Riverside.jpg';
    case 'dave@alice.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Dave+-+Alice.png';
    case 'don.flake@english3.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/donflake.jpg';
    case 'moroni.flake@english3.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/moroniflake.jpg';
    case 'md@test.con':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic26.jpg';
    case 'facilitator@riversidecompany.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/picLynn.jpg';
    default:
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic16.jpg';
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
    'mat-icon': 'business_center',
    label: 'RMCF SALES EXCELLENCE DASHBOARD',
    link: '/master-dashboard',
    restrict: ({ user }) => user.roles.is_riverside_managing_director
  },
  {
    'mat-icon': 'dashboard',
    label: 'SALES EXCELLENCE DASHBOARD',
    link: '/dashboard',
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
    label: 'REQUEST FEEDBACK',
    modalComponent: RequestFeedbackComponent,
    restrict: ({ user }) => !user.roles.is_riverside_managing_director
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
    restrict: ({nav}) => !!nav.module.current && !['/dashboard', '/master-dashboard'].includes(nav.getRouter().url),
    className: 'material-icons-outlined',
    labelFn: ({nav}) => (nav.module.current || {name: ''}).name.toUpperCase(),
    linkFn(nav: ModuleNavService) {
      const module = nav.module.current;
      const stepId = module.steps[module.steps.length - 1].id;
      return `/module/${module.id}/step/${stepId}`;
    }
  },
];
