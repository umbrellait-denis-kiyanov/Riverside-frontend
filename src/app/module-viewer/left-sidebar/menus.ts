import User from "../../common/interfaces/user.model";
import { RequestFeedbackComponent } from "../request-feedback/request-feedback.component";
import { ModuleNavService } from "src/app/common/services/module-nav.service";
import { feedback_svg } from "./feedback.icon";
import { map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";

interface RestrictOptions {
  nav: ModuleNavService;
  user: User;
}

interface MenuItemType {
  className?: string;
  label?: string;
  link?: string;
  "mat-icon"?: string;
  linkFn?(nav: ModuleNavService): Observable<string>;
  labelFn?(nav: ModuleNavService): Observable<string>;
  render?(user: BehaviorSubject<User>): Observable<string>;
  restrict?(params: Partial<RestrictOptions>): boolean;
  modalComponent?: typeof RequestFeedbackComponent;
  counter?: number;
  labelObservable?: Observable<string>;
  linkObservable?: Observable<string>;
  renderObservable?: Observable<string>;
  restrictObservable?: Observable<boolean>;
}

type MenusInterface = MenuItemType[];

// For SUPER temporary use
const hardCodePictures = (user: User) => {
  if (user.profile_picture) {
    return user.profile_picture;
  }
  switch (user.email) {
    case "dan@riverside.com":
    case "dperry@omnigo.com":
    case "dperry@riversidecompany.com":
    case "dperry@logically.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/Dan+-+Riverside.jpg";
    case "dave@alice.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/Dave+-+Alice.png";
    case "don.flake@english3.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/donflake.jpg";
    case "moroni.flake@english3.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/moroniflake.jpg";
    case "md@test.con":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/pic26.jpg";
    case "facilitator@riversidecompany.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/Buyer+Personas+images/picLynn.jpg";
    case "mark.kornegay@omnigo.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/Mark+Kornegay.jpg";
    case "mputney@logically.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/matt-putney.jpg";
    case "jauer@riversidecompany.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/johnauer.jpg";
    case "joederosa@safebuilt.com":
    case "jderosa@safebuilt.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/jderosa.jpg";
    case "dhaynes@riversidecompany.com":
      return "https://riverside-seagage.s3-us-west-2.amazonaws.com/HaynesDanWebsite.jpg";
    default:
      return null;
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
          } else {
            return `<div class="letter-image">${usr.abbreviation}</div>`;
          }
        })
      );
    },
    label: "ACCOUNT",
    link: "/account"
  },
  {
    "mat-icon": "business_center",
    label: "RMCF SALES EXCELLENCE DASHBOARD",
    link: "/master-dashboard",
    restrict: ({ user }) => user.permissions.riversideRMCFDashboard
  },
  {
    "mat-icon": "dashboard",
    label: "SALES EXCELLENCE TRANSFORMATIONAL ROADMAP",
    linkFn(nav: ModuleNavService) {
      return nav.organization$.pipe(map(org => `/dashboard/${org}`));
    },
    restrict: ({ user }) => user.permissions.riversideSalesDashboard
  },
  {
    "mat-icon": "view_module",
    labelFn: (nav: ModuleNavService) => {
      return nav.moduleDataReplay$.pipe(map(mod => mod.name.toUpperCase()));
    },
    linkFn(nav: ModuleNavService) {
      return nav.moduleDataReplay$.pipe(
        map(
          orgModule => `/org/${orgModule.status.org_id}/module/${orgModule.id}`
        )
      );
    }
  },
  {
    "mat-icon": "build",
    label: "EDITOR",
    linkFn(nav: ModuleNavService) {
      return nav.module$.pipe(map(mod => `/builder/${mod}`));
    },
    restrict: ({ user }) => user.permissions.riversideModuleEditor
  },

  {
    render: () => new BehaviorSubject(feedback_svg),
    label: "REQUEST FEEDBACK",
    modalComponent: RequestFeedbackComponent,
    restrict: ({ user }) => user.permissions.riversideRequestFeedback
  },
  {
    "mat-icon": "email",
    className: "material-icons-outlined",
    label: "INBOX",
    link: "/inbox",
    counter: 0,
    restrict: ({ user }) =>
      user.permissions.riversideRequestFeedback ||
      user.permissions.riversideProvideFeedback
  },
  {
    "mat-icon": "assessment",
    label: "ASSESSMENT",
    linkFn(nav: ModuleNavService) {
      return nav.organization$.pipe(map(org => `/org/${org}/assessment`));
    },
    restrict: ({ user }) => true
  }
];
