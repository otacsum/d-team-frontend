import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
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
    [key: string]: any;  // assignment_id: {grade_id: id, points_earned: savedValue, points_entered: newValue}

}

interface ColumnsForVariableRows {
    key: string; // assignment_id
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
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public sessionHandler: SessionHandler,
        public dataSource: MatTableDataSource<any>,
    ) {}

    gradebookForm = this.fb.group({
        pointsEarned: [null, Validators.compose(
            [
                Validators.required,
                Validators.min(0),
            ]
        )]
    });

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
                        // Populate empty points first, in case this
                        // assignment for this student hasn't been graded yet
                        studentRow[assignment.id] = {
                            grade_id: '',
                            points_earned: '',
                            points_entered: '',
                        };
                        // Look for grades for this student, and add them if present
                        // Mitigates sequelize structure limitation (contains grades for many students)
                        assignment.grades.forEach(grade => {
                            // The grade is for the current student, replace blank values.
                            if (grade.person_id == studentRecord.person_id) {
                                studentRow[assignment.id] = {
                                    grade_id: grade.id,
                                    points_earned: grade.points_earned,
                                    points_entered: grade.points_earned,
                                };
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

    submitGrade(
        personId: string,
        assignmentId: string,
        rowIndex: any,
        studentRow: StudentRowsVariableKeys
    ) {
        const gradeId = studentRow[assignmentId].grade_id;
        const pointsEntered = studentRow[assignmentId].points_entered;

        // Create a grade
        if (gradeId === '' && pointsEntered >= 0) {
            const grade: Grade = {
                person_id: personId,
                assignment_id: assignmentId,
                points_earned: pointsEntered,
            }

            this.assignmentGradesService.create(grade)
                .subscribe(result => {
                    // Update the local dataset to ensure UI logic reflects update.
                    this.studentRows[rowIndex][assignmentId].points_earned = pointsEntered;
                    this.studentRows[rowIndex][assignmentId].grade_id = result.id;
                });
        }
        // Delete a grade  (must come first due to 'truthiness' of update condition)
        else if (pointsEntered == null) {
            const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Delete Grade?',
                    prompt: 'Are you sure you want to delete this grade?  Did you mean to enter zero ( 0 ) points?',
                    buttonText: 'Delete',
                },
                width: '250px',
            });

            deleteDialog.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.assignmentGradesService.remove(gradeId)
                        .subscribe(result => {
                            // Update the local dataset to ensure UI logic reflects update.
                            this.studentRows[rowIndex][assignmentId].points_earned = null;
                            this.studentRows[rowIndex][assignmentId].grade_id = '';
                        });
                }
            });
        }
        // Update a grade
        else if (pointsEntered >= 0) {
            const grade: Grade = {
                points_earned: pointsEntered,
            }

            this.assignmentGradesService.update(gradeId, grade)
                .subscribe(result => {
                    // Update the local dataset to ensure UI logic reflects update.
                    this.studentRows[rowIndex][assignmentId].points_earned = pointsEntered;
                });
        }
    }
}
