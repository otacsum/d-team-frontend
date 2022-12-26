import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {TeacherCredential} from '../interfaces/teacher-credential.interface';
import {Person} from '../interfaces/person.interface';
import {Success} from '../interfaces/success.interface';
import {MessageHandler} from '../lib/message-handler';

@Injectable({
    providedIn: 'root'
})

export class TeacherCredentialService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private credentialUrl = Environment.apiBaseUrl + '/credential';
    private serviceLoggingName = 'CourseService';

    create(credential: TeacherCredential): Observable<Success> {
        return this.http.post<Success>(this.credentialUrl, credential)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: ID (${successPayload.id}) created`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Created? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`${this.serviceLoggingName}: create`))
            );
    }

    findAll(teacherId: string): Observable<TeacherCredential[]> {
        return this.http.get<TeacherCredential[]>(this.credentialUrl + `/teacher/${teacherId}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched credentials`)),
                catchError(this.messageHandler.handleError<TeacherCredential[]>(`${this.serviceLoggingName}: getPeople`, []))
            );
    }

    findOne(id: string): Observable<TeacherCredential> {
        return this.http.get<TeacherCredential>(this.credentialUrl + `/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched ${id}`)),
                catchError(this.messageHandler.handleError<TeacherCredential>(`${this.serviceLoggingName}: findOne`))
            );
    }

    update(id: string, credential: TeacherCredential): Observable<Success> {
        return this.http.patch<Success>(this.credentialUrl + `/${id}`, credential)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: ID (${credential.id}) updated properties sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Updated Successfully? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`${this.serviceLoggingName}: error`))
            );
    }

    remove(id: string): Observable<Success> {
        return this.http.delete<TeacherCredential>(this.credentialUrl + `/${id}`)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Remove ID (${id}) sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Successfully deactivated ${id}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`${this.serviceLoggingName}: error`))
            );
    }
}
