import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { E3CommonModule } from '../common/e3-common.module';
import { StandaloneRecorderComponent } from './standalone-recorder/standalone-recorder.component';

const exports = [StandaloneRecorderComponent];

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, E3CommonModule],
  declarations: exports,
  exports
})
export class VideoRecorderModule {}
