import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Person} from '../interfaces/person.interface';
//import {People} from '../interfaces/people.mock';
import {Success} from '../interfaces/success.interface';
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

    updatePerson(id: string, person: Person): Observable<Success> {
        return this.http.patch<Success>(this.personUrl + `/${id}`, person)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`PersonService: Person ID (${person.id}) updated properties sent`);
                    this.messageHandler
                        .log(`PersonService: Updated Successfully? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>('PersonService: error'))
            );
    }

    createPerson(person: Person): Observable<Success> {
        return this.http.post<Success>(this.personUrl, person)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`PersonService: Person ID (${successPayload.id}) created`);
                    this.messageHandler
                        .log(`PersonService: Created? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>('PersonService: error'))
            );
    }
}
