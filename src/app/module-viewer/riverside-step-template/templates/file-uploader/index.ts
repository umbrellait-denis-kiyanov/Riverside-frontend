import { TemplateContentDataBase } from '../template.interface';


export interface FileUploaderTemplateData extends TemplateContentDataBase {
    template_params_json: {
        title: string;
        description: string;
        step_select: 'Image' | 'XLS Spreadshset' | 'CSV Spreadsheet'
    };
}

export const TemplateParams = `{
        title: string;
        description: string;
        step_select: 'Image' | 'XLS Spreadshset' | 'CSV Spreadsheet'
}`;
