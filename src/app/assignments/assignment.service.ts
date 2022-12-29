import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import { Assignment } from '../interfaces/assignment.interface';
import {Success} from '../interfaces/success.interface';
import {MessageHandler} from '../lib/message-handler';

@Injectable({
    providedIn: 'root'
})

export class AssignmentService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private assignmentUrl = Environment.apiBaseUrl + '/assignment';
    private serviceLoggingName = 'AssignmentService';

    create(assignment: Assignment): Observable<Success> {
        return this.http.post<Success>(this.assignmentUrl, assignment)
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

    findAll(courseId: string): Observable<Assignment[]> {
        return this.http.get<Assignment[]>(this.assignmentUrl + `/course/${courseId}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched assignments for course`)),
                catchError(this.messageHandler.handleError<Assignment[]>(`${this.serviceLoggingName}: findAll`, []))
            );
    }

    findAllForStudent(courseId: string, studentId: string): Observable<Assignment[]> {
        return this.http.get<Assignment[]>(this.assignmentUrl + `/course/${courseId}/student/${studentId}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched assignments for course`)),
                catchError(this.messageHandler.handleError<Assignment[]>(`${this.serviceLoggingName}: findAll`, []))
            );
    }

    findOne(id: string): Observable<Assignment> {
        return this.http.get<Assignment>(this.assignmentUrl + `/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched ${id}`)),
                catchError(this.messageHandler.handleError<Assignment>(`${this.serviceLoggingName}: findOne`))
            );
    }

    update(id: string, assignment: Assignment): Observable<Success> {
        return this.http.patch<Success>(this.assignmentUrl + `/${id}`, assignment)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: ID (${assignment.id}) updated properties sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Updated Successfully? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`${this.serviceLoggingName}: error`))
            );
    }

    remove(id: string): Observable<Success> {
        return this.http.delete<Assignment>(this.assignmentUrl + `/${id}`)
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
