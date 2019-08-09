
import { NgModule } from '@angular/core';
import { E3CheckboxComponent } from './components/e3-checkbox/e3-checkbox.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { E3TooltipDirective } from '../common/components/e3-tooltip/e3-tooltip.directive';
import { E3AsyncButtonDirective } from './components/e3-async-button/e3-async-button.directive';
import { FormatDatePipe } from './pipes/fomartdate.pipe';
import { E3ScrollSpyDirective } from './components/e3-scrollspy/e3-scrollspy.directive';

const exports = [
  E3CheckboxComponent,
  E3TooltipDirective,
  E3AsyncButtonDirective,
  E3ScrollSpyDirective
];
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  declarations: exports,
  entryComponents: [
    // E3CheckboxComponent
  ],
  providers: [
  ],
  bootstrap: [],
  exports
})
export class E3CommonModule { }
