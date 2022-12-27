import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Person} from '../interfaces/person.interface';
import {Success} from '../interfaces/success.interface';
import {MessageHandler} from '../lib/message-handler';

@Injectable({
    providedIn: 'root'
})

export class PersonService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private personUrl = Environment.apiBaseUrl + '/person';

    create(person: Person): Observable<Success> {
        return this.http.post<Success>(this.personUrl, person)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`PersonService: Person ID (${successPayload.id}) created`);
                    this.messageHandler
                        .log(`PersonService: Created? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>('PersonService: create'))
            );
    }

    findAll(): Observable<Person[]> {
        return this.http.get<Person[]>(this.personUrl)
            .pipe(
                tap(_ => this.messageHandler.log('PersonService: fetched people')),
                catchError(this.messageHandler.handleError<Person[]>('PersonService: getPeople', []))
            );
    }

    findAllTeachers(): Observable<Person[]> {
        return this.http.get<Person[]>(this.personUrl + '/type/teacher')
            .pipe(
                tap(_ => this.messageHandler.log('PersonService: fetched people')),
                catchError(this.messageHandler.handleError<Person[]>('PersonService: getPeople', []))
            );
    }

    findOne(id: string): Observable<Person> {
        return this.http.get<Person>(this.personUrl + `/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`PersonService: fetched person ${id}`)),
                catchError(this.messageHandler.handleError<Person>('PersonService: findOne'))
            );
    }

    update(id: string, person: Person): Observable<Success> {
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

    removePerson(id: string): Observable<Success> {
        return this.http.delete<Person>(this.personUrl + `/${id}`)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`PersonService: Remove ID (${id}) sent`);
                    this.messageHandler
                        .log(`PersonService: Successfully deactivated person ${id}`);
                }),
                catchError(this.messageHandler.handleError<Success>('PersonService: error'))
            );
    }
}
