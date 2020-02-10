import { TemplateContentDataBase } from '../template.interface';
import {Item} from './Item';


export interface CheckboxSelectorTemplateData extends TemplateContentDataBase {
    template_params_json: {
        title: string;
        align_right: boolean;
        show_descriptions: boolean;
        description: string;
        minimum_of_required_selections: number;
        maximum_of_required_selections: number;
        options: Array<Item>
    };
}

export const TemplateParams = `{
        title: string;
        minimum_of_required_selections: number;
        maximum_of_required_selections: number;
        align_right: boolean;
        show_descriptions: boolean;
        options: Array<{title: string, id: number, description: string , checked: boolean}>
}`;
