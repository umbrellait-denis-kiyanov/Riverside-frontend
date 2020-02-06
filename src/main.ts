// import './index.ng1';

/*
 * Entry point of the application.
 * Only platform bootstrapping code should be here.
 * For app-specific initialization, use `app/app.component.ts`.
 */

import { ModuleBuilderModule } from './app/module-builder/module-builder.module';
import { StaticProvider, enableProdMode } from '@angular/core';
import { TimedReviewComponent } from './app/video_recorder/timed-review/timed-review.component';
import { ModuleBuilderRootComponent } from './app/module-builder/module-builder-root.component';
import { ModuleViewerModule } from './app/module-viewer/module-viewer.module';
import { ModuleViewerRootComponent } from './app/module-viewer/module-viewer-root.component';
import { environment } from './environments/environment';
import './globals';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

window.CONSTANTS = environment;

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(ModuleViewerModule);

// if (environment.hmr) {
//   hmrBootstrap(module, bootstrap);
// } else {
  bootstrap().catch(err => console.error(err));
// }
