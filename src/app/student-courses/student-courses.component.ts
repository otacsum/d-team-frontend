import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";

import {Course} from '../interfaces/course.interface';
import {StudentCourseService} from './student-course.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {SessionHandler} from '../lib/session-handler';
import {StudentCourse} from '../interfaces/student-course.interface';
import {GradeHandler} from '../lib/grade-handler';

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
        private gradeHandler: GradeHandler,
    ) {}

    studentCourses: StudentCourse[] = [];

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
        {
            key: 'letter_grade',
            header: 'Grade',
        },
    ];

    columnsToDisplayWithExpand = [...this.columnsToDisplay.map(column => column.key), 'expand'];
    expandedCourse = {} as Course;

    ngOnInit(): void {
        this.getCourses();
    }

    getCourses(): void {
        this.studentCourseService.findAllByUser(this.studentId)
            .subscribe(studentCourses => {
                this.studentCourses = studentCourses;
                this.calculateCourseGrades();
                this.dataSource = new MatTableDataSource(this.studentCourses);

        console.log((this.dataSource));
            });
    }

    dropCourse(studentCourse: StudentCourse): void {
        const dropCourseDialog = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Are you sure?',
                prompt: `Drop ${studentCourse.course.subject_abbreviation} ${studentCourse.course.code}?`,
                buttonText: 'Drop this Course',
            },
            width: '250px',
        });

        dropCourseDialog.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.studentCourseService.dropCourse(studentCourse.course_id, studentCourse.person_id)
                    .subscribe(result => {
                        this.ngOnInit();
                    });
            }
        });
    }

    calculateCourseGrades(): void {
        this.studentCourses.forEach(course => {
            let totalPointsPossible = 0;
            let totalPointsEarned = 0;

            // Sum up the points possible and earned for each assignment
            if (course.course.assignments) {
                course.course.assignments.forEach(assignment => {
                    if (assignment.grades && assignment.grades.length > 0) {
                        totalPointsPossible += assignment.points_possible;
                        totalPointsEarned += assignment.grades[0].points_earned;
                    }
                });
            }

            // Get the overall letter grade for the course
            course.course.letter_grade = this.gradeHandler.getLetterGrade(totalPointsPossible, totalPointsEarned);
        });
    }

    applyFilter(filterValue: String) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
