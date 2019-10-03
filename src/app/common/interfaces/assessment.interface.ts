export interface AssessmentType {
   id: number;
   name: string;
   description: string;
}

export interface AssessmentGroup {
    id: number;
    name: string;
    description: string;
    questions: AssessmentQuestion[]
}

export interface AssessmentQuestion {
    id: number;
    name: string;
}

export interface AssessmentAnswer {
    question_id: number;
    session_id: number;
    answer: boolean;
    notes: string;
}

export interface AssessmentOrgGroup {
    group_id: number;
    importance: number;
    isDone: boolean;
    score: number;
    answers: AssessmentAnswer[];
}
