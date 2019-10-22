import User from '../../common/interfaces/user.model';
import { RequestFeedbackComponent } from '../request-feedback/request-feedback.component';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { feedback_svg } from './feedback.icon';
import { review_svg } from './review.icon';
import { of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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
  if (user.profile_picture) {
    return user.profile_picture;
  }
  switch (user.email) {
    case 'dan@riverside.com':
    case 'dperry@omnigo.com':
    case 'dperry@riversidecompany.com':
    case 'dperry@logically.com':
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
    case 'mark.kornegay@omnigo.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/Mark+Kornegay.jpg';
    case 'mputney@logically.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/matt-putney.jpg';
    case 'jauer@riversidecompany.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/johnauer.jpg';
    case 'joederosa@safebuilt.com':
    case 'jderosa@safebuilt.com':
      return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/jderosa.jpg';
    case 'dhaynes@riversidecompany.com':
       return 'https://riverside-seagage.s3-us-west-2.amazonaws.com/HaynesDanWebsite.jpg';
    default:
      return '';
  }
};

export const menus: MenusInterface = [
  {
    render(user: BehaviorSubject<User>) {
      return user.pipe(
        map((usr: User) => {
          const src = usr.profile_picture || hardCodePictures(usr);
          if (src) {
            return `<img src=${src} style="width: 35px; height: 35px; border-radius: 35px">`;
          } else { return `<div class="letter-image">${usr.name[0].toUpperCase() + usr.lname[0].toUpperCase()}</div>`; }

        })
      );
    },
    label: 'ACCOUNT',
    link: '/account',
  },
  {
    'mat-icon': 'business_center',
    label: 'RMCF SALES EXCELLENCE DASHBOARD',
    link: '/master-dashboard',
    restrict: ({ user }) => user.permissions.riversideRMCFDashboard
  },
  {
    'mat-icon': 'dashboard',
    label: 'SALES EXCELLENCE DASHBOARD',
    linkFn(nav: ModuleNavService) {
      return `/dashboard/${nav.lastOrganization.current}`;
    },
    restrict: ({ user }) => user.permissions.riversideSalesDashboard
  },
  {
    'mat-icon': 'view_module',
    labelFn: ({nav}) => {
      return (nav.module.current || {name: ''}).name.toUpperCase();
    },
    linkFn(nav: ModuleNavService) {
      const module = nav.module.current;
      return `/org/${nav.lastOrganization.current}/module/${module.id}`;
    }
  },
  {
    'mat-icon': 'build',
    label: 'EDITOR',
    linkFn(nav: ModuleNavService) {
      return `/builder/${nav.module.current.id || 1}`;
    },
    restrict: ({ user }) => user.permissions.riversideModuleEditor
  },

  {
    render: () => new BehaviorSubject(feedback_svg),
    label: 'REQUEST FEEDBACK',
    modalComponent: RequestFeedbackComponent,
    restrict: ({ user }) => user.permissions.riversideRequestFeedback
  },
  {
    'mat-icon': 'email',
    className: 'material-icons-outlined',
    label: 'INBOX',
    link: '/inbox',
    counter: 0,
    restrict: ({ user }) => user.permissions.riversideRequestFeedback || user.permissions.riversideProvideFeedback
  },
  {
    render: () => new BehaviorSubject(review_svg),
    restrict: ({nav}) => !!nav.module.current && !['/dashboard', '/master-dashboard'].includes(nav.getRouter().url),
    className: 'material-icons-outlined',
    labelFn: ({nav}) => {
      const module = nav.module.current;
      return module.steps[module.steps.length - 1].description.toUpperCase() + ' - ' +
            (nav.module.current || {name: ''}).name.toUpperCase();
    },
    linkFn(nav: ModuleNavService) {
      const module = nav.module.current;
      const stepId = module.steps[module.steps.length - 1].id;
      return `/org/${nav.lastOrganization.current}/module/${module.id}/step/${stepId}`;
    }
  },
  {
    'mat-icon': 'assessment',
    label: 'ASSESSMENT',
    linkFn(nav: ModuleNavService) {
      return `/org/${nav.lastOrganization.current}/assessment`;
    }
  }
];
