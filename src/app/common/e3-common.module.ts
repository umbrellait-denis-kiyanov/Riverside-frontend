
import { NgModule } from '@angular/core';
import { E3CheckboxComponent } from './components/e3-checkbox/e3-checkbox.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    E3CheckboxComponent
  ],
  entryComponents: [
    // E3CheckboxComponent
  ],
  providers: [
  ],
  bootstrap: [],
  exports: [
    E3CheckboxComponent
  ]
})
export class E3CommonModule { }
