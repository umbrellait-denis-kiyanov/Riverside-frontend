
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleViewerRootComponent } from './module-viewer-root.component';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './module-viewer-routing.module';
import { RouterModule } from '@angular/router';
import { ModuleService } from '../common/services/module.service';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { ContentComponent } from './content/content.component';
import { E3CheckboxComponent } from '../common/components/e3-checkbox/e3-checkbox.component';
import { LoadingComponent } from '../common/components/loading/loading.component';
import { SafeurlPipe } from '../common/pipes/safeurl.pipe';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], {useHash: true, enableTracing: true}),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule

  ],
  declarations: [
    ModuleViewerRootComponent,
    MainComponent,
    LeftMenuComponent,
    ContentComponent,
    E3CheckboxComponent,
    LoadingComponent,
    SafeurlPipe
  ],
  entryComponents: [
    ModuleViewerRootComponent
  ],
  providers: [
    ModuleService,
  ],
  bootstrap: [ModuleViewerRootComponent]
})
export class ModuleViewerModule { }
