import {Person} from "./person.interface";

export interface Gradebook {
    id?: string;
    person_id?: string;
    course_id?: string;
    student: any;
    course: {
        assignments: [{
            id: string;
            type: string;
            title: string;
            points_possible: number;
            grades: [{
                id: string;
                person_id: string;
                points_earned: number;
            }]
        }]
    };
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}
