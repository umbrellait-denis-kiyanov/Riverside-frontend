
import { NgModule } from '@angular/core';
import { E3CheckboxComponent } from './components/e3-checkbox/e3-checkbox.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { E3TooltipDirective } from '../common/components/e3-tooltip/e3-tooltip.directive';
import { E3AsyncButtonDirective } from './components/e3-async-button/e3-async-button.directive';

import { E3ScrollSpyDirective } from './components/e3-scrollspy/e3-scrollspy.directive';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { E3ConfirmationDialogComponent } from './components/e3-confirmation-dialog/e3-confirmation-dialog.component';
import { E3ConfirmationDialogService } from './components/e3-confirmation-dialog/e3-confirmation-dialog.service';
import { SafehtmlPipe } from './pipes/safehtml.pipe';
import { MatButtonModule } from '@angular/material/button';

const exports = [
  E3CheckboxComponent,
  E3TooltipDirective,
  E3AsyncButtonDirective,
  E3ScrollSpyDirective,
  E3ConfirmationDialogComponent,
  SafehtmlPipe
];
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    NgbModalModule,
    MatButtonModule,
  ],
  declarations: exports,
  entryComponents: [
    E3ConfirmationDialogComponent
  ],
  providers: [
    E3ConfirmationDialogService
  ],
  bootstrap: [],
  exports
})
export class E3CommonModule { }
