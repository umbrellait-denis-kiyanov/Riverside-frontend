// tslint:disable-next-line:label-position
export const TemplateDefinitions = {
    age_gender: `{
        description: string;
        title: string;
        instructions?: string;
    }`,

    brainstorm: `{
        description: string;
        title: string;
    }`,

    feedback_section: `{
        description: string;
        title: string;
        instructions: string;
        steps: Array<{
        sufix: string,
        title: string;
        }>
    }`,

    final_feedback: `{
        description: string;
        title: string;
        instructions: string;
        steps: Array<{
            sufix: string,
            title: string;
        }>
    }`,

    generic: `{
        description: string;
        content: string;
        title: string;
    }`,

    personas: `{
        description: string;
        resource: string;
        title: string;
    }`,

    narrow_down: `{
        description: string;
        title: string;
    }`,

    persona_picture: `{
        description: string;
        title: string;
    }`,

    persona_behavior: `{
        description: string;
        resource: string;
        example: string;
        instructions: string;
        title: string;
        input_sufix: string;
        behavior: string;
        formatAsList: boolean;
        selection_matrix: Array<{
        question: string,
        options: Array<{option: string}>
        }>
    }`,

    question_image: `{
        description: string;
        instructions: string;
        image: string;
        title: string;
        questions: Array<{question: string}>
    }`,

    segment_criteria_define: `{
        step_select: '1_define_segments' | '2_brainstorm_criteria' | '3_define_criteria' |
                   '4_assign_weight' | '5_request_feedback_section_1' | '6_decide_letter_grades' |
                   '7_grade_customers' | '8_request_feedback_section_2';
        description: string;
        instructions?: string;
        number_of_inputs: number;
        inputs: string;
        title: string;
    }`,

    spreadsheet: `{
        description: string;
        apiResource: string;
        visibleRows: string;
        title: string;
        requireFeedback: boolean;
        calculateFormulasOnServer: boolean;
    }`,

    video: `{
        description: string;
        videoUrl: string;
        content: string;
        title: string;
    }`,
};

