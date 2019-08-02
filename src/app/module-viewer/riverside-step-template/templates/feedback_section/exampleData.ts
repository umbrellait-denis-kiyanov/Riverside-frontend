import { FeedbackSectionTemplateData } from './feedback_section.interface';

export const data: FeedbackSectionTemplateData['template_params_json'] = {
  title: 'FEEDBACK',
  description: `
  <p>Your Managing Director would like to see feedback on the work you have done so far.</p>
  `,
  instructions: `In addition to responding to the content you have created, what help would you like from your
  Managing Director? What is going well and what are you struggling with?`,
  steps: [
    {sufix: 'how_they_buy', title: 'How they buy'},
    {sufix: 'how_they_pay', title: 'How they pay'},
    {sufix: 'titles', title: 'Titles'},
    {sufix: 'watering_holes', title: 'Watering holes'}
  ]
};
