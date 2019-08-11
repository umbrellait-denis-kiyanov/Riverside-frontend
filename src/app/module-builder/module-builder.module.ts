
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
import { MatcherComponent } from './matcher/matcher.component';
import { ModuleSelectorComponent } from './module-selector/module-selector.component';
import { ModuleService } from '../common/services/module.service';
import { RiversideStepTemplateComponent } from '../module-viewer/riverside-step-template/riverside-step-template.component';
import { Template1Component } from '../module-viewer/riverside-step-template/templates/template1/template1.component';
import { E3CheckboxComponent } from '../common/components/e3-checkbox/e3-checkbox.component';
import { E3CommonModule } from '../common/e3-common.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StepTemplateEditorComponent } from './module-editor/step-template-editor/step-template-editor.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], {useHash: true, enableTracing: true}),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    E3CommonModule,
    DragDropModule
  ],
  declarations: [
    ModuleBuilderRootComponent,
    ModuleEditorComponent,
    MainComponent,
    MatcherComponent,
    ModuleSelectorComponent,
    StepTemplateEditorComponent,
    // E3CheckboxComponent

  ],
  entryComponents: [
    ModuleBuilderRootComponent,
    StepTemplateEditorComponent
  ],
  providers: [
    ModuleService,
  ],
  bootstrap: [ModuleBuilderRootComponent]
})
export class ModuleBuilderModule { }
