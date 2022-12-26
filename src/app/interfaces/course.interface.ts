export interface Course {
    id?: string;
    person_id?: string;
    student_count?: number;
    subject_abbreviation: string;
    code: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    instructor?: {};
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}
