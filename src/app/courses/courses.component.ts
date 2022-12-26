import {Component, Input, Inject} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

import {Course} from '../interfaces/course.interface';
import {CourseService} from './course.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {SessionHandler} from '../lib/session-handler';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class CoursesComponent {

    constructor(
        private courseService: CourseService,
        public dialog: MatDialog,
        public sessionHandler: SessionHandler,
        public dataSource: MatTableDataSource<Course>,
    ) {}

    course: Course[] = [];
    columnsToDisplay = ['subject_abbreviation', 'code', 'title'];
    columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    expandedCourse = {} as Course;

    ngOnInit(): void {
        this.getCourses();
    }

    getCourses(): void {
        this.courseService.findAll()
            .subscribe(course => {
                this.course = course;
                this.dataSource = new MatTableDataSource(course);
            });
    }

    joinCourse(id: string, courseName: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Join Course?',
                prompt: `re you sure you want to join ${courseName}`
            },
            width: '250px',
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.courseService.joinCourse(id, this.sessionHandler.userId)
                    .subscribe(result => {
                        this.ngOnInit();
                    });
            }
        });


    }

    removeCourse(id: string): void {
        this.courseService.removeCourse(id)
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
                this.removeCourse(id);
            }
        });
    }
}
