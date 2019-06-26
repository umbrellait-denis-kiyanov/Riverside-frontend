
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExampleDowngradeComponent } from './example_downgrade/example_downgrade.component';
import { TimedReviewComponent } from './video_recorder/timed-review/timed-review.component';
import { TimedReviewIframeComponent } from './video_recorder/timed-review/timed-review-iframe/timed-review-iframe.component';
import { SafeurlPipe } from './common/pipes/safeurl.pipe';
import { LoadingComponent } from './common/components/loading/loading.component';
import { E3CheckboxComponent } from './common/components/e3-checkbox/e3-checkbox.component';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  declarations: [
    ExampleDowngradeComponent,
    TimedReviewIframeComponent,
    TimedReviewComponent,
    SafeurlPipe,
    LoadingComponent,
    E3CheckboxComponent
  ],
  entryComponents: [
    LoadingComponent,
    TimedReviewComponent,
    TimedReviewIframeComponent

  ],
  bootstrap: [TimedReviewComponent]
})
export class TimedReviewModule { }
