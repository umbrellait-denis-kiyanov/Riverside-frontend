

import Ng1App from '../../../public/js/app';
import Ng1RiversideModuleBuilderApp from './ng1modules/riverside_module_builder';
import Ng1RiversideModuleViewerApp from './ng1modules/riverside_module_viewer';
// import * as angular from '../../../public/lib/angular-1.3.2.min'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { downgradeModule, downgradeComponent } from '@angular/upgrade/static';
// import { ExampleDowngradeComponent } from './app/example_downgrade/example_downgrade.component'

import { ModuleBuilderModule } from './app/module-builder/module-builder.module';
import { StaticProvider, enableProdMode } from '@angular/core';
import { TimedReviewComponent } from './app/video_recorder/timed-review/timed-review.component';
import { ModuleBuilderRootComponent } from './app/module-builder/module-builder-root.component';
import { ModuleViewerModule } from './app/module-viewer/module-viewer.module';
import { ModuleViewerRootComponent } from './app/module-viewer/module-viewer-root.component';
import { environment } from './environments/environment';
import './globals';



window.CONSTANTS = environment;

// if (environment.production) {
//   enableProdMode();
// }
enableProdMode();

const bootstrapFn = (module) => (extraProviders: StaticProvider[] ) => {
  return platformBrowserDynamic(extraProviders).bootstrapModule(module);

};

const downgradedRiversideModuleBuilderModule = downgradeModule(bootstrapFn(ModuleBuilderModule));
const downgradedRiversideModuleViewerModule = downgradeModule(bootstrapFn(ModuleViewerModule));


Ng1RiversideModuleBuilderApp.requires.push(downgradedRiversideModuleBuilderModule);
Ng1RiversideModuleViewerApp.requires.push(downgradedRiversideModuleViewerModule);

// Ng1App.directive('testDowngrade', downgradeComponent({ component: ExampleDowngradeComponent }))
Ng1App.directive('appTimedReview', downgradeComponent({ component: TimedReviewComponent }));
Ng1RiversideModuleBuilderApp.directive('appModuleBuilderRoot', downgradeComponent({ component: ModuleBuilderRootComponent }));
Ng1RiversideModuleViewerApp.directive('appModuleViewerRoot', downgradeComponent({ component: ModuleViewerRootComponent }));
// Ng1App.directive('testDowngrade', downgradeComponent({ component: ExampleDowngradeComponent }))

window.app = Ng1App;
