import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {Assignment} from 'src/app/interfaces/assignment.interface';
import {AssignmentService} from '../assignment.service';
import {MessageHandler} from '../../lib/message-handler';
import {SessionHandler} from '../../lib/session-handler';

@Component({
    selector: 'app-assignment-detail',
    templateUrl: './assignment-detail.component.html',
    styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent {

    constructor(
        private route: ActivatedRoute,
        private assignmentService: AssignmentService,
        private location: Location,
        private fb: FormBuilder,
        private router: Router,
        private messageHandler: MessageHandler,
        public sessionHandler: SessionHandler,
    ) {}

    assignment = {} as Assignment;
    isNewAssignment = (this.router.url.indexOf('/assignment/create') >= 0);
    id = String(this.route.snapshot.paramMap.get('id'));
    courseId = String(this.route.snapshot.paramMap.get('courseId'));
    minDate: Date = new Date();

    assignmentForm = this.fb.group({
        type: [null, Validators.required],
        points_possible: [null, Validators.required],
        due_date: [null, Validators.required],
        title: [null, Validators.required],
        description: [null, Validators.required],
    });

    types = [
        'assignment',
        'exam',
    ]

    ngOnInit(): void {
        if (!this.isNewAssignment) {
            this.getAssignment();
        }

        this.messageHandler
            .log(`Router.URL: ${this.router.url}`);
    }

    getAssignment(): void {
        this.assignmentService.findOne(this.id)
            .subscribe(assignment => this.assignment = assignment);
    }

    goBack(): void {
        this.location.back();
    }

    submit(): void {
        if (this.isNewAssignment) {
            this.assignment.course_id = this.courseId;
            this.assignmentService.create(this.assignment)
                .subscribe(result => {
                    if (result.success) {
                        this.messageHandler
                            .log(`Create Assignment: Success, redirecting to all assignments.`);
                        this.router.navigate([`/course/${this.courseId}`]);
                    } else {
                        this.messageHandler
                            .log(`Create Assignment: Error: ${result.message}`);
                    }
                });
        } else {
            this.assignmentService.update(this.id, this.assignment)
                .subscribe(result => {
                    if (result.success) {
                        this.messageHandler
                            .log(`Update Assignment: Successful Update, redirecting to all assignments.`);
                        this.router.navigate([`/course/${this.courseId}`]);
                    } else {
                        this.messageHandler
                            .log(`Update Assignment: Error: ${result.message}`);
                    }
                });
        }

    }

}
