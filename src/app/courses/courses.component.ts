import {Component, Input, Inject} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

import {Course} from '../interfaces/course.interface';
import {CourseService} from './course.service';
import {ConfirmDeleteComponent} from '../confirm-delete/confirm-delete.component';
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
    ) {}
    
    course: Course[] = [];
    columnsToDisplay = ['subject_abbreviation', 'code', 'title'];
    columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    expandedCourse = {} as Course;
    dataSource = {} as MatTableDataSource<Course>;

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

    removeCourse(id: string): void {
        this.courseService.removeCourse(id)
            .subscribe(result => result = result);
    }

    applyFilter(filterValue: String) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openDialog(id: string, prompt: string): void {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            data: {
                prompt: prompt
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
