import { Course } from "./course.interface";

export interface Assignment {
    id?: string;
    course_id: string;
    type: string;
    title: string;
    description: string;
    due_date: string;
    points_possible: number;
    'course.subject_abbreviation'?: string;
    'course.code'?: number;
    'course.title'?: string;
    'course.person_id'?: string;
    'grades.points_earned'?: number;
    letter_grade?: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}
