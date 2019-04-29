

import Ng1App from '../../../public/js/app';
// import * as angular from '../../../public/lib/angular-1.3.2.min'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { downgradeModule, downgradeInjectable, downgradeComponent } from '@angular/upgrade/static';
// import { ExampleDowngradeComponent } from './app/example_downgrade/example_downgrade.component'

import { AppModule } from './app/app.module';
import { StaticProvider, enableProdMode } from '@angular/core';
import { TimedReviewComponent } from './app/video_recorder/timed-review/timed-review.component';
import { environment } from './environments/environment';



declare global {
  interface Window { app: any; }
}

// if (environment.production) {
//   enableProdMode();
// }
enableProdMode();

const bootstrapFn = (extraProviders: StaticProvider[]) => {
  return platformBrowserDynamic(extraProviders).bootstrapModule(AppModule);

};

const downgradedModule = downgradeModule(bootstrapFn);

Ng1App.requires.push(downgradedModule);

// Ng1App.directive('testDowngrade', downgradeComponent({ component: ExampleDowngradeComponent }))
Ng1App.directive('appTimedReview', downgradeComponent({ component: TimedReviewComponent }));
// Ng1App.directive('testDowngrade', downgradeComponent({ component: ExampleDowngradeComponent }))
window.app = Ng1App;
