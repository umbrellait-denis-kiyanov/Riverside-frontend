import { TemplateContentDataBase } from '../template.interface';


export interface RadiobuttonTemplateData extends TemplateContentDataBase {
    template_params_json: {
        title: string;
        description: string;
        require_selection: boolean;
        step_select: 'Title Only' |
                     'Title And Description' |
                     'Title Description And Image';
        options: Array<{title: string , image: string , description: string}>
    };
}
