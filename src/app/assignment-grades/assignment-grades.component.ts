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
import {GradeHandler} from '../lib/grade-handler';


interface StudentRowsVariableKeys {
    student: {
        id: string;
        first_name: string;
        last_name: string;
    };
    totalPointsPossible: number;
    totalPointsEarned: number;
    letter_grade: string;
    [key: string]: any;     /* assignment_id: {
                                    grade_id: id, 
                                    points_possible: fromAssignmentObject, 
                                    points_earned: savedValueFromDB, 
                                    points_entered: newValueEntered
                            } */

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
        private gradeHandler: GradeHandler,
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

    assignmentIds: string[] = [];  // for iterating keys during grade calculations

    columnDefsToDisplay: string[] = []; // Controls which columns to display in mat table.

    ngOnInit(): void {
        this.getAssignments();
        this.getGrades();
    }

    getAssignments(): void {
        this.assignmentService.findAll(this.courseId)
            .subscribe(assignments => {
                // Populate the dynamic headers object with assignment details.
                assignments.forEach(assignment => {

                    this.assignmentIds.push(assignment.id!);

                    const column: ColumnsForVariableRows = {
                        key: assignment.id!,
                        headerText: assignment.title,
                        pointsPossible: assignment.points_possible,
                        dueDate: assignment.due_date,
                        type: assignment.type,
                    };
                    this.columnsToDisplay.push(column);
                });

                this.columnsToDisplay.push({
                    key: 'letter_grade',
                    headerText: 'Grade',
                });

                this.columnDefsToDisplay = [...this.columnsToDisplay.map(column => column.key)];
            });
    }

    getGrades(): void {
        this.assignmentGradesService.findAll(this.courseId)
            .subscribe(gradebook => {
                // Populate the dynamic table object with rows data.
                gradebook.forEach(studentRecord => {
                    let studentRow: StudentRowsVariableKeys = {
                        student: studentRecord.student,
                        totalPointsPossible: 0,
                        totalPointsEarned: 0,
                        letter_grade: '',
                    };

                    studentRecord.course.assignments.forEach(assignment => {
                        // Populate empty points first, in case this
                        // assignment for this student hasn't been graded yet
                        studentRow[assignment.id] = {
                            grade_id: '',
                            points_possible: assignment.points_possible,
                            points_earned: null,
                            points_entered: null,
                        };
                        // Look for grades for this student, and add them if present
                        // Mitigates sequelize structure limitation (contains grades for many students)
                        assignment.grades.forEach(grade => {
                            // The grade is for the current student, replace blank values.
                            if (grade.person_id == studentRecord.person_id) {

                                // If the student has eligible points, sum into the possible and earned.
                                //studentRow.totalPointsEarned += grade.points_earned;
                                //studentRow.totalPointsPossible += assignment.points_possible;

                                // Add the points for this assignment so they can be shown in the form.
                                studentRow[assignment.id] = {
                                    grade_id: grade.id,
                                    points_possible: assignment.points_possible,
                                    points_earned: grade.points_earned,
                                    points_entered: grade.points_earned,
                                };
                            }
                        })
                    });

                    //studentRow.letter_grade = this.gradeHandler
                    //.getLetterGrade(studentRow.totalPointsPossible, studentRow.totalPointsEarned);

                    this.studentRows.push(studentRow);
                });

                this.calculatePointsAndLetterGrades();
                this.dataSource = new MatTableDataSource(this.studentRows);
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
                    this.calculatePointsAndLetterGrades();
                });
        }
        // Delete a grade  (must come first due to 'truthiness' of update condition)
        else if (pointsEntered === null) {
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
                            this.calculatePointsAndLetterGrades();
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
                    this.calculatePointsAndLetterGrades();
                });
        }
    }

    calculatePointsAndLetterGrades(): void {
        this.studentRows.forEach(studentRow => {
            let totalPointsPossible = 0;
            let totalPointsEarned = 0;

            this.assignmentIds.forEach(assignmentId => {
                // If points have been earned, calculate eligible & earned into total.
                if (!(studentRow[assignmentId].points_earned === null)) {
                    totalPointsPossible += studentRow[assignmentId].points_possible;
                    totalPointsEarned += studentRow[assignmentId].points_earned;
                }
            });

            // Assign to row object for error checking.
            studentRow.totalPointsPossible = totalPointsPossible;
            studentRow.totalPointsEarned = totalPointsEarned;

            // Calculate the letter grade and display it.
            studentRow.letter_grade = this.gradeHandler
                .getLetterGrade(studentRow.totalPointsPossible, studentRow.totalPointsEarned);

        });
    }
}
