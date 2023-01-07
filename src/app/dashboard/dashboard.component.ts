import {Component, OnInit} from '@angular/core';

import {Person} from '../interfaces/person.interface';
import {PersonService} from '../people/person.service';
import {Course} from '../interfaces/course.interface';
import {SessionHandler} from '../lib/session-handler';
import {StudentCourseService} from '../student-courses/student-course.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    constructor(
        private personService: PersonService,
        private studentCourseService: StudentCourseService,
        public sessionHandler: SessionHandler,
    ) {}

    isLoggedIn = this.sessionHandler.loggedIn;
    userId = this.sessionHandler.userId;
    userRole = this.sessionHandler.userRole;

    user = {} as Person;
    courses: Course[] = [];

    ngOnInit(): void {
        this.getUser();
        this.getCourses();
    }

    getUser(): void {
        this.personService.findOne(this.userId)
            .subscribe(person => this.user = person);
    }

    getCourses(): void {
        if (this.userRole == 'student') {
            this.studentCourseService.findAllByUser(this.userId)
                .subscribe(studentCourses => {
                    studentCourses.forEach(studentCourse => {
                        this.courses.push(studentCourse.course);
                    });
                });
        }
    }
}
