import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";

import {Grade} from '../interfaces/grade.interface';
import {AssignmentGradesService} from './assignment-grades.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatTableDataSource, MatTableDataSourcePaginator} from '@angular/material/table';
import {SessionHandler} from '../lib/session-handler';
import {AssignmentService} from '../assignments/assignment.service';


interface StudentRowsVariableKeys {
    student: {
        id: string;
        first_name: string;
        last_name: string;
    };
    [key: string]: any; // assignment_id: points_earned
}

interface ColumnsForVariableRows {
    key: string; // Assignment ID
    headerText: string;
    pointsPossible?: number;
    dueDate?: string;
    type?: string;
}

@Component({
    selector: 'app-assignment-grades',
    templateUrl: './assignment-grades.component.html',
    styleUrls: ['./assignment-grades.component.css'],
})

export class AssignmentGradeComponent {

    constructor(
        private assignmentGradesService: AssignmentGradesService,
        private assignmentService: AssignmentService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public sessionHandler: SessionHandler,
        public dataSource: MatTableDataSource<any>,
    ) {}

    //@Input() courseTeacherId: string = '';
    courseId = String(this.route.snapshot.paramMap.get('courseId'));
    userRole = this.sessionHandler.userRole;

    studentRows = [] as StudentRowsVariableKeys[];

    columnsToDisplay: ColumnsForVariableRows[] = [
        {
            key: 'student',
            headerText: 'Name',
        },
    ];

    columnDefsToDisplay: string[] = [];    

    ngOnInit(): void {
        this.getAssignments();
        this.getGrades();
    }

    getGrades(): void {
        this.assignmentGradesService.findAll(this.courseId)
            .subscribe(gradebook => {
                // Populate the dynamic table object with rows data.
                gradebook.forEach(studentRecord => {
                    let studentRow: StudentRowsVariableKeys = {
                        student: studentRecord.student,
                    };
                    studentRecord.course.assignments.forEach(assignment => {
                        assignment.grades.forEach(grade => {
                            if (grade.person_id == studentRecord.person_id) {
                                studentRow[assignment.id] = grade.points_earned;
                            }
                        })
                    });
                    this.studentRows.push(studentRow);
                });

                this.dataSource = new MatTableDataSource(this.studentRows);
            });
    }

    getAssignments(): void {
        this.assignmentService.findAll(this.courseId)
            .subscribe(assignments => {
                // Populate the dynamic headers object with assignment details.
                assignments.forEach(assignment => {
                    const column: ColumnsForVariableRows = {
                        key: assignment.id!,
                        headerText: assignment.title,
                        pointsPossible: assignment.points_possible,
                        dueDate: assignment.due_date,
                        type: assignment.type,
                    };
                    this.columnsToDisplay.push(column);
                });

                this.columnDefsToDisplay = [...this.columnsToDisplay.map(column => column.key)];
            });
    }

    remove(id: string): void {
        this.assignmentGradesService.remove(id)
            .subscribe(result => {
                this.ngOnInit();
            });
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
                this.remove(id);
            }
        });
    }
}
