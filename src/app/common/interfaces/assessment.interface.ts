export interface AssessmentType {
    id: number;
    name: string;
    description: string;
 }

export interface AssessmentSession {
    id: number;
    org_id: number;
    isDone: boolean;
    type: number;
    name: string;
    date: Date;
}

export interface AssessmentGroup {
    id: number;
    name: string;
    shortName: string;
    description: string;
    position: number;
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
