import { FinalFeedbackTemplateData } from './final-feedback.interface';

export const data: FinalFeedbackTemplateData['template_params_json'] = {
  title: 'FEEDBACK',
  description: `
  <p>Your Managing Director would like to see feedback on your Buyer Personas.
  Look over your work and submit it when you’re read for feedback.</p>
  `,
  instructions: `In addition to responding to the content you have created, what help would you like from your
  Managing Director? What is going well and what are you struggling with?`,
  steps: [
    {sufix: 'how_they_buy', title: 'How they buy'},
    {sufix: 'how_they_pay', title: 'How they pay'},
    {sufix: 'titles', title: 'Titles'},
    {sufix: 'watering_holes', title: 'Watering holes'},
    {sufix: 'buying_process', title: 'The Buying Process'},
  ]
};
