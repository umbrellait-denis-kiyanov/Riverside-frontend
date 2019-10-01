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
