import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Gradebook} from '../interfaces/gradebook.interface';
import {Success} from '../interfaces/success.interface';
import {MessageHandler} from '../lib/message-handler';
import {Grade} from '../interfaces/grade.interface';

@Injectable({
    providedIn: 'root'
})

export class AssignmentGradesService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private gradeUrl = Environment.apiBaseUrl + '/grade';
    private allGradesUrl = Environment.apiBaseUrl + '/assignment/course';
    private serviceLoggingName = 'GradesService';

    create(grade: Grade): Observable<Success> {
        return this.http.post<Success>(this.gradeUrl, grade)
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

    findAll(courseId: string): Observable<Gradebook[]> {
        return this.http.get<Gradebook[]>(this.allGradesUrl + `/${courseId}/grades`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched grades for course ${courseId}`)),
                catchError(this.messageHandler.handleError<Gradebook[]>(`${this.serviceLoggingName}: findAll`, []))
            );
    }

    update(id: string, grade: Grade): Observable<Success> {
        return this.http.patch<Success>(this.gradeUrl + `/${id}`, grade)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: ID (${id}) updated properties sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Updated Successfully? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`${this.serviceLoggingName}: error`))
            );
    }

    remove(id: string): Observable<Success> {
        return this.http.delete<Success>(this.gradeUrl + `/${id}`)
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
