import {Person} from "./person.interface";

export interface Success {
    id?: string;
    createdAt?: string;
    success?: boolean;
    message?: string;
    person?: Person;
}
