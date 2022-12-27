import { Course } from "./course.interface";

export interface Assignment {
    id?: string;
    course_id: string;
    type: string;
    title: string;
    description: string;
    due_date: string;
    points_possible: number;
    course: Course;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}
