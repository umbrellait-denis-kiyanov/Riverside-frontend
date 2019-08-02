
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
import { LeftMenuComponent } from './left-menu/module/module-left-menu.component';
import { ContentComponent } from './content/content.component';
import { E3CheckboxComponent } from '../common/components/e3-checkbox/e3-checkbox.component';
import { LoadingComponent } from '../common/components/loading/loading.component';
import { SafeurlPipe } from '../common/pipes/safeurl.pipe';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LearningElementComponent } from './modals/learning-element/learning-element.component';

import { UserService } from '../common/services/user.service';
import { IceComponent } from './ice/ice.component';
import { RiversideStepTemplateComponent } from './riverside-step-template/riverside-step-template.component';
import { RTemplateDirective } from './riverside-step-template/riverside-step-template-host.directive';
import { Template1Component } from './riverside-step-template/templates/template1/template1.component';
import { SafehtmlPipe } from '../common/pipes/safehtml.pipe';
import { ModuleContentService } from '../common/services/module-content.service';
import { LetterImageComponent } from './ice/letter-image/letter-image.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { UserComponent } from './ice/user/user.component';
import { IceService } from './ice/ice.service';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { InboxComponent } from './inbox/inbox.component';
import { LeftMenuService } from '../common/services/left-menu.service';
import { InboxLeftMenuComponent } from './left-menu/inbox/inbox-left-menu.component';
import { AccountLeftMenuComponent } from './left-menu/account/account-left-menu.component';
import { E3TableComponent } from '../common/components/e3-table/e3-table.component';
import { InboxService } from './inbox/inbox.service';
import { ModuleBuilderModule } from '../module-builder/module-builder.module';
import { RequestFeedbackComponent } from './request-feedback/request-feedback.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { E3CommonModule } from '../common/e3-common.module';
import { ModuleNavComponent } from './content/module-nav/module-nav.component';
import { ModuleNavService } from '../common/services/module-nav.service';
import { Template2Component } from './riverside-step-template/templates/template2/template2.component';
import { Template3Component } from './riverside-step-template/templates/template3/template3.component';
import { BrainstormTemplateComponent } from './riverside-step-template/templates/brainstorm/brainstorm.component';
import { GenericTemplateComponent } from './riverside-step-template/templates/generic/generic.component';
import { NamePersonasTemplateComponent } from './riverside-step-template/templates/name_personas/name_personas.component';
import { PersonaBehaviorTemplateComponent } from './riverside-step-template/templates/persona_behavior/persona_behavior.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], { useHash: true, enableTracing: true }),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    NgbModalModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ModuleBuilderModule,
    CKEditorModule,
    E3CommonModule
  ],
  declarations: [
    ModuleViewerRootComponent,
    MainComponent,
    LeftMenuComponent,
    InboxLeftMenuComponent,
    AccountLeftMenuComponent,
    ContentComponent,
    // E3CheckboxComponent,
    LoadingComponent,
    SafeurlPipe,
    SafehtmlPipe,
    LearningElementComponent,

    IceComponent,
    RiversideStepTemplateComponent,
    RTemplateDirective,
    Template1Component,
    LetterImageComponent,
    UserComponent,
    LeftSidebarComponent,
    InboxComponent,
    E3TableComponent,
    RequestFeedbackComponent,
    ModuleNavComponent,
    Template2Component,
    Template3Component,
    BrainstormTemplateComponent,
    GenericTemplateComponent,
    NamePersonasTemplateComponent,
    PersonaBehaviorTemplateComponent

  ],
  entryComponents: [
    ModuleViewerRootComponent,
    LearningElementComponent,
    RequestFeedbackComponent,
    Template1Component,
    Template2Component,
    Template3Component,
    BrainstormTemplateComponent,
    GenericTemplateComponent,
    NamePersonasTemplateComponent,
    PersonaBehaviorTemplateComponent
  ],
  providers: [
    ModuleService,
    ModuleNavService,
    ModuleContentService,
    UserService,
    IceService,
    LeftMenuService,
    InboxService
  ],
  bootstrap: [ModuleViewerRootComponent]
})
export class ModuleViewerModule { }
