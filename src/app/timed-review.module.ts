import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExampleDowngradeComponent } from './example_downgrade/example_downgrade.component';
import { TimedReviewComponent } from './video_recorder/timed-review/timed-review.component';
import { TimedReviewIframeComponent } from './video_recorder/timed-review/timed-review-iframe/timed-review-iframe.component';
import { LoadingComponent } from './common/components/loading/loading.component';
import { E3CheckboxComponent } from './common/components/e3-checkbox/e3-checkbox.component';
import { E3CommonModule } from './common/e3-common.module';
import { ModuleViewerModule } from './module-viewer/module-viewer.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    E3CommonModule,
    ModuleViewerModule
  ],
  declarations: [
    ExampleDowngradeComponent,
    TimedReviewIframeComponent,
    TimedReviewComponent
  ],
  entryComponents: [TimedReviewComponent, TimedReviewIframeComponent],
  bootstrap: [TimedReviewComponent]
})
export class TimedReviewModule {}
