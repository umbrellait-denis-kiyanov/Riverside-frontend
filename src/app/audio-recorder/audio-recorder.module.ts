import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { E3CommonModule } from "../common/e3-common.module";
import { AudioRecorderComponent } from "./audio-recorder.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

const exports = [AudioRecorderComponent];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    E3CommonModule,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule
  ],
  declarations: exports,
  exports
})
export class AudioRecorderModule {}
