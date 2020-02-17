import { TemplateContentDataBase } from '../template.interface';

export class Item {
    id: number;
    title: string;
    description: string;
    checked: boolean = false;
}


export interface CheckboxSelectorTemplateData extends TemplateContentDataBase {
    template_params_json: {
        title: string;
        align_right: boolean;
        show_descriptions: boolean;
        description: string;
        minimum_of_required_selections: number;
        maximum_of_required_selections: number;
        options: Array<{title: string, id: number, description: string , checked: boolean}>
    };
}
