import {Course} from "./course.interface";

export interface StudentCourse {
    id?: string;
    person_id: string;
    course_id: string;
    course: Course;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    
}
