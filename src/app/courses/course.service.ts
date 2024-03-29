import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Course} from '../interfaces/course.interface';
import {Success} from '../interfaces/success.interface';
import {MessageHandler} from '../lib/message-handler';

@Injectable({
    providedIn: 'root'
})

export class CourseService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private courseUrl = Environment.apiBaseUrl + '/course';
    private serviceLoggingName = 'CourseService';

    create(course: Course): Observable<Success> {
        return this.http.post<Success>(this.courseUrl, course)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: ID (${successPayload.id}) created`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Created? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`ERROR in ${this.serviceLoggingName}: create`))
            );
    }

    findAll(): Observable<Course[]> {
        return this.http.get<Course[]>(this.courseUrl)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched courses`)),
                catchError(this.messageHandler.handleError<Course[]>(`ERROR in ${this.serviceLoggingName}: findAll`, []))
            );
    }

    findAllByTeacher(id: string): Observable<Course[]> {
        return this.http.get<Course[]>(this.courseUrl + `/teacher/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched courses for teacher ${id}`)),
                catchError(this.messageHandler.handleError<Course[]>(`ERROR in ${this.serviceLoggingName}: findAllByTeacher`, []))
            );
    }

    findAllByStudent(id: string): Observable<Course[]> {
        return this.http.get<Course[]>(this.courseUrl + `/student/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched courses for student ${id}`)),
                catchError(this.messageHandler.handleError<Course[]>(`ERROR in ${this.serviceLoggingName}: findAllByStudent`, []))
            );
    }

    findOne(id: string): Observable<Course> {
        return this.http.get<Course>(this.courseUrl + `/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched course ${id}`)),
                catchError(this.messageHandler.handleError<Course>(`ERROR in ${this.serviceLoggingName}: findOne`))
            );
    }

    update(id: string, course: Course): Observable<Success> {
        return this.http.patch<Success>(this.courseUrl + `/${id}`, course)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: ID (${course.id}) updated properties sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Updated Successfully? ${successPayload.success}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`ERROR in ${this.serviceLoggingName}: error`))
            );
    }

    remove(id: string): Observable<Success> {
        return this.http.delete<Course>(this.courseUrl + `/${id}`)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Remove ID (${id}) sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Successfully deactivated ${id}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`ERROR in ${this.serviceLoggingName}: error`))
            );
    }

    joinCourse(id: string, studentId: string): Observable<Success> {
        return this.http.post<Course>(this.courseUrl + `/${id}/students/${studentId}`, null)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Student ${studentId} register for course (${id}) sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Successfully registered to course ${id}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`ERROR in ${this.serviceLoggingName}: error`))
            );
    }
}
