import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {StudentCourse} from '../interfaces/student-course.interface';
import {Course} from '../interfaces/course.interface';
import {Success} from '../interfaces/success.interface';
import {MessageHandler} from '../lib/message-handler';

@Injectable({
    providedIn: 'root'
})

export class StudentCourseService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private courseUrl = Environment.apiBaseUrl + '/course';
    private serviceLoggingName = 'StudentCourseService';

    findAllByUser(id: string): Observable<StudentCourse[]> {
        return this.http.get<StudentCourse[]>(this.courseUrl + `/student/${id}`)
            .pipe(
                tap(_ => this.messageHandler.log(`${this.serviceLoggingName}: fetched courses for user ${id}`)),
                catchError(this.messageHandler.handleError<StudentCourse[]>(`ERROR in ${this.serviceLoggingName}: findAll`, []))
            );
    }

    dropCourse(courseId: string, studentId: string): Observable<Success> {
        return this.http.delete<Course>(this.courseUrl + `/${courseId}/students/${studentId}`)
            .pipe(
                tap((successPayload: Success) => {
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Remove ID (${courseId}) sent`);
                    this.messageHandler
                        .log(`${this.serviceLoggingName}: Successfully deactivated ${courseId}`);
                }),
                catchError(this.messageHandler.handleError<Success>(`ERROR in ${this.serviceLoggingName}: error`))
            );
    }
}
