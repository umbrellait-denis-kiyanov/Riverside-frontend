
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
import { RiversideStepTemplateComponent } from '../common/components/riverside-step-template/riverside-step-template.component';
import { Template1Component } from '../common/components/riverside-step-template/templates/template1/template1.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], {useHash: true, enableTracing: true}),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    ModuleBuilderRootComponent,
    ModuleEditorComponent,
    MainComponent,
    MatcherComponent,
    ModuleSelectorComponent,
    RiversideStepTemplateComponent,
    Template1Component,
  ],
  entryComponents: [
    ModuleBuilderRootComponent
  ],
  providers: [
    ModuleService,
  ],
  bootstrap: [ModuleBuilderRootComponent]
})
export class ModuleBuilderModule { }
