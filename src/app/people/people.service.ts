import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Person} from '../interfaces/person.interface';
//import {People} from '../interfaces/people.mock';
import {MessageService} from '../messages/message.service';

@Injectable({
    providedIn: 'root'
})

export class PeopleService {
    constructor(
        private messageService: MessageService,
        private http: HttpClient,
    ) {}

    private personUrl = Environment.apiBaseUrl + '/person';

    getPeople(): Observable<Person[]> {
        return this.http.get<Person[]>(this.personUrl)
            .pipe(
                tap(_ => this.log('fetched people')),
                catchError(this.handleError<Person[]>('getPeople', []))
            );
    }

    getPerson(id: string): Observable<Person> {
        return this.http.get<Person>(this.personUrl + `/${id}`)
            .pipe(
                tap(_ => this.log(`fetched person ${id}`)),
                catchError(this.handleError<Person>('getPeople'))
            );;
    }

    /** Log a PeopleService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`PeopleService: ${message}`);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
