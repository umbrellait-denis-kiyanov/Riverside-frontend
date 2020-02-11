import { FeedbackSectionTemplateData } from '.';

export const data: FeedbackSectionTemplateData['template_params_json'] = {
  title: 'FEEDBACK',
  description: ``,
  instructions: ``,
  steps: [
    { sufix: 'how_they_buy', title: 'How they buy' },
    { sufix: 'how_they_pay', title: 'How they pay' },
    { sufix: 'titles', title: 'Titles' },
    { sufix: 'watering_holes', title: 'Watering holes' }
  ]
};
