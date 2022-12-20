import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {Course} from '../../interfaces/course.interface';
import {CourseService} from '../course.service';
import {Person} from '../../interfaces/person.interface';
import { PersonService } from 'src/app/people/person.service';
import {MessageHandler} from '../../lib/message-handler';

@Component({
    selector: 'app-courses-detail',
    templateUrl: './course-detail.component.html',
    styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent {

    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private personService: PersonService,
        private location: Location,
        private fb: FormBuilder,
        private messageHandler: MessageHandler,
        private router: Router,
    ) {}


    isCreateCourse = (this.router.url == '/course/create');
    private serviceLoggingName = 'CourseService: Details:';

    courseForm = this.fb.group({
        subjectAbbreviation: [null, Validators.required],
        code: [null, Validators.compose(
            [
                Validators.required,
                Validators.minLength(3)
            ]
        )],
        title: [null, Validators.required],
        description: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        teacher: [null, Validators.required],
    });
    
    teachers: Person[] = [];

    subjects = [
        {name: 'Chemistry & Bio-Chemistry', abbreviation: 'CHEM'},
        {name: 'Computer Science & Engineering', abbreviation: 'CSE'},
        {name: 'Economics', abbreviation: 'ECON'},
        {name: 'History', abbreviation: 'HIST'},
        {name: 'Literature & Language Arts', abbreviation: 'LIT'},
        {name: 'Mathematics', abbreviation: 'MATH'},
        {name: 'Music Theory & Performance', abbreviation: 'MUS'},
        {name: 'Physics', abbreviation: 'PHYS'},
    ];

    ngOnInit(): void {
        if (!this.isCreateCourse) {
            this.getCourse();
        }

        this.getTeachers();
        
        this.messageHandler
            .log(`Router.URL: ${this.router.url}`);
    }

    @Input() course = {} as Course;

    getCourse(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.courseService.findOne(id)
            .subscribe(course => this.course = course);
    }

    getTeachers(): void {
        this.personService.findAllTeachers()
            .subscribe(teachers => {
                this.teachers = teachers;               
            });
    }

    goBack(): void {
        this.location.back();
    }

    onSubmit(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        if (this.isCreateCourse) {
            this.courseService.create(this.course)
                .subscribe(result => {
                    if (result.success) {
                        this.messageHandler
                            .log(`${this.serviceLoggingName}: Successfully created, redirecting to all.`);
                        this.router.navigate(['/courses']);
                    } else {
                        this.messageHandler
                            .log(`ERROR in ${this.serviceLoggingName}: ${result.message}`);
                    }
                });
        } else {
            this.courseService.update(id, this.course)
                .subscribe(result => {
                    if (result.success) {
                        this.messageHandler
                            .log(`${this.serviceLoggingName}: Successfully updated, redirecting to all.`);
                        this.router.navigate(['/courses']);
                    } else {
                        this.messageHandler
                            .log(`ERROR in ${this.serviceLoggingName}: ${result.message}`);
                    }
                });
        }

    }

}
