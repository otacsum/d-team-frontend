import {Person} from "./person.interface";

export interface TeacherCredential {
    id?: string;
    person_id: string;
    job_title: string;
    rank: string;
    credential_type: string;
    subject_abbreviation: string;
    person: Person;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}
