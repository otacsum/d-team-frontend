import {Person} from "./person.interface";

export interface Course {
    // Native DB returns
    id?: string;
    person_id?: string;
    student_count?: number;
    subject_abbreviation: string;
    code: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;

    // Added by API modifiers or by local service logic
    instructor?: Person;
    students?: string[];
    assignments?: [{
        id: string;
        points_possible: number;
        grades?: [{
            id: string;
            points_earned: number;
        }]
    }];
    letter_grade?: string;
}
