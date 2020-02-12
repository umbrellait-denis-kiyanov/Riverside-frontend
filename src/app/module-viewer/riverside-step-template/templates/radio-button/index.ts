import { TemplateContentDataBase } from '../template.interface';
import {Item} from './Item';


export interface RadiobuttonTemplateData extends TemplateContentDataBase {
    template_params_json: {
        title: string;
        description: string;
        require_selection: boolean;
        step_select: 'Title Only' |
                     'Title And Description' |
                     'Title Description And Image';
        options: Array<Item>
    };
}

export const TemplateParams = `{
     title: string;
     description: string;
     require_selection: boolean;
     step_select: 'Title_only' |
                     'Title_and_description' |
                     'Title_description_and_image';
     options: Array<{title:string,description:string,image:string}>
}`;
