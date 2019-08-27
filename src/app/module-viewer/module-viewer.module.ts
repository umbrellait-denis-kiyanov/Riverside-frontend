
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
import { LoadingComponent } from '../common/components/loading/loading.component';
import { LearningElementComponent } from './modals/learning-element/learning-element.component';
import { UserService } from '../common/services/user.service';
import { IceComponent } from './ice/ice.component';
import { RiversideStepTemplateComponent } from './riverside-step-template/riverside-step-template.component';
import { RTemplateDirective } from './riverside-step-template/riverside-step-template-host.directive';
import { Template1Component } from './riverside-step-template/templates/template1/template1.component';
import { ModuleContentService } from '../common/services/module-content.service';
import { LetterImageComponent } from './ice/letter-image/letter-image.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
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
import { FeedbackSectionTemplateComponent } from './riverside-step-template/templates/feedback_section/feedback_section.component';
import { FormatDatePipe } from '../common/pipes/fomartdate.pipe';
import { PersonaPictureTemplateComponent } from './riverside-step-template/templates/persona-picture/persona-picture.component';
import { PersonaPictureListComponent } from './riverside-step-template/templates/persona-picture/persona-picture-list/persona-picture-list.component';
import { FinalFeedbackComponent } from './riverside-step-template/templates/final-feedback/final-feedback.component';
import { PersonaComponent } from './riverside-step-template/persona/persona.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AgeGenderComponent } from './riverside-step-template/templates/age-gender/age-gender.component';
import { VideoRecorderModule } from '../video_recorder/video-recorder.module';
import { FeedbackSourceComponent } from './request-feedback/feedback-source/feedback-source.component';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], { useHash: true, enableTracing: true }),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    ModuleBuilderModule,
    CKEditorModule,
    E3CommonModule,
    VideoRecorderModule
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
    FormatDatePipe,
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
    PersonaBehaviorTemplateComponent,
    FeedbackSectionTemplateComponent,
    PersonaPictureTemplateComponent,
    PersonaPictureListComponent,
    FinalFeedbackComponent,
    PersonaComponent,
    AgeGenderComponent,
    FeedbackSourceComponent

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
    PersonaBehaviorTemplateComponent,
    FeedbackSectionTemplateComponent,
    PersonaPictureTemplateComponent,
    PersonaPictureListComponent,
    FinalFeedbackComponent,
    AgeGenderComponent
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
