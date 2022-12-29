import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";

import {Course} from '../interfaces/course.interface';
import {StudentCourseService} from './student-course.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {SessionHandler} from '../lib/session-handler';
import {StudentCourse} from '../interfaces/student-course.interface';

@Component({
    selector: 'app-student-courses',
    templateUrl: './student-courses.component.html',
    styleUrls: ['./student-courses.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class StudentCoursesComponent {

    @Input() studentId: string = '';

    constructor(
        private studentCourseService: StudentCourseService,
        public dialog: MatDialog,
        public sessionHandler: SessionHandler,
        public dataSource: MatTableDataSource<StudentCourse>,
    ) {}

    studentCourse: StudentCourse[] = [];

    columnsToDisplay = [
        {
            key: 'subject_abbreviation',
            header: 'Subject',
        },
        {
            key: 'code',
            header: 'Level',
        },
        {
            key: 'title',
            header: 'Title',
        },
        {
            key: 'start_date',
            header: 'Starts',
        },
        {
            key: 'end_date',
            header: 'Ends',
        },
    ];

    columnsToDisplayWithExpand = [...this.columnsToDisplay.map(column => column.key), 'expand'];
    expandedCourse = {} as Course;

    ngOnInit(): void {
        this.getCourses();
    }

    getCourses(): void {
        this.studentCourseService.findAllByUser(this.studentId)
            .subscribe(studentCourse => {
                this.studentCourse = studentCourse;
                this.dataSource = new MatTableDataSource(studentCourse);
            });
    }

    dropCourse(id: string): void {
        this.studentCourseService.dropCourse(id)
            .subscribe(result => {
                this.ngOnInit();
            });
    }

    applyFilter(filterValue: String) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openDialog(id: string, title: string, prompt: string, buttonText: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: title,
                prompt: prompt,
                buttonText: buttonText,
            },
            width: '250px',
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                //this.removeCourse(id);
            }
        });
    }
}