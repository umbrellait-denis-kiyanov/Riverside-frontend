import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleBuilderRootComponent } from './module-builder-root.component';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './module-builder-routing.module';
import { ModuleEditorComponent } from './module-editor/module-editor.component';
import { RouterModule } from '@angular/router';
import { ModuleSelectorComponent } from './module-selector/module-selector.component';
import { ModuleService } from '../common/services/module.service';
import { E3CommonModule } from '../common/e3-common.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StepTemplateEditorComponent } from './module-editor/step-template-editor/step-template-editor.component';
import { StepLinkEditorComponent } from './module-editor/step-link-editor/step-link-editor.component';
import { StepTemplateFieldComponent } from './module-editor/step-template-editor/step-template-field/step-template-field.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatIconModule } from '@angular/material/icon';
import { BuilderSelectOptionPipe } from './module-editor/builder-select-option.pipe';
import { HotTableModule } from '@handsontable/angular';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], { useHash: true, enableTracing: true }),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    E3CommonModule,
    DragDropModule,
    CKEditorModule,
    MatIconModule,
    HotTableModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    ModuleBuilderRootComponent,
    ModuleEditorComponent,
    MainComponent,
    ModuleSelectorComponent,
    StepTemplateEditorComponent,
    StepLinkEditorComponent,
    StepTemplateFieldComponent,
    BuilderSelectOptionPipe
  ],
  entryComponents: [
    ModuleBuilderRootComponent,
    StepTemplateEditorComponent,
    StepLinkEditorComponent,
    StepTemplateFieldComponent
  ],
  providers: [ModuleService],
  bootstrap: [ModuleBuilderRootComponent]
})
export class ModuleBuilderModule {}
