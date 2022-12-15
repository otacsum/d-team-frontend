import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Person} from '../interfaces/person.interface';
//import {People} from '../interfaces/people.mock';
import { MessageHandler } from '../lib/message-handler';

@Injectable({
    providedIn: 'root'
})

export class PeopleService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private personUrl = Environment.apiBaseUrl + '/person';

    getPeople(): Observable<Person[]> {
        return this.http.get<Person[]>(this.personUrl)
            .pipe(
                tap(_ => this.messageHandler.log('PersonService: fetched people')),
                catchError(this.messageHandler.handleError<Person[]>('PersonService: getPeople', []))
            );
    }

    getPerson(id: string): Observable<Person> {
        return this.http.get<Person>(this.personUrl + `/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`PersonService: fetched person ${id}`)),
                catchError(this.messageHandler.handleError<Person>('PersonService: getPerson'))
            );
    }
}
