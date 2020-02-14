import { NarrowDownComponent } from './narrow-down/narrow-down.component';
import { BrainstormTemplateComponent } from './brainstorm/brainstorm.component';
import { GenericTemplateComponent } from './generic/generic.component';
import { NamePersonasTemplateComponent } from './name_personas/name_personas.component';
import { PersonaBehaviorTemplateComponent } from './persona_behavior/persona_behavior.component';
import { FeedbackSectionTemplateComponent } from './feedback_section/feedback_section.component';
import { PersonaPictureTemplateComponent } from './persona-picture/persona-picture.component';
import { FinalFeedbackComponent } from './final-feedback/final-feedback.component';
import { AgeGenderComponent } from './age-gender/age-gender.component';
import { QuestionImageComponent } from './question-image/question-image.component';
import { SegmentCriteriaDefineComponent } from './segment-criteria-define/segment-criteria-define.component';
import { VideoComponent } from './video/video.component';
import { SpreadsheetComponent } from './spreadsheet/spreadsheet.component';
import { PreRequisiteModulesComponent } from './pre-requisite-modules/pre-requisite-modules.component';
import { ModuleResultComponent } from './module-result/module-result.component';
import { PersonaStrategyComponent } from './persona-strategy/persona-strategy.component';
import { CampaignCalendarTemplateComponent } from './campaign-calendar-template/campaign-calendar-template.component';

export const Templates = {
  narrow_down: NarrowDownComponent,
  brainstorm: BrainstormTemplateComponent,
  campaign_calendar: CampaignCalendarTemplateComponent,
  generic: GenericTemplateComponent,
  name_personas: NamePersonasTemplateComponent,
  persona_behavior: PersonaBehaviorTemplateComponent,
  segment_criteria_define: SegmentCriteriaDefineComponent,
  feedback_section: FeedbackSectionTemplateComponent,
  persona_picture: PersonaPictureTemplateComponent,
  final_feedback: FinalFeedbackComponent,
  age_gender: AgeGenderComponent,
  module_result: ModuleResultComponent,
  pre_requisite_modules: PreRequisiteModulesComponent,
  question_image: QuestionImageComponent,
  spreadsheet: SpreadsheetComponent,
  video: VideoComponent,
  persona_strategy: PersonaStrategyComponent
};
