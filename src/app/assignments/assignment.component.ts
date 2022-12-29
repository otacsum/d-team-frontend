import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";

import {Assignment} from '../interfaces/assignment.interface';
import {AssignmentService} from './assignment.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {SessionHandler} from '../lib/session-handler';

@Component({
    selector: 'app-assignment',
    templateUrl: './assignment.component.html',
    styleUrls: ['./assignment.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class AssignmentComponent {

    constructor(
        private assignmentService: AssignmentService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public sessionHandler: SessionHandler,
        public dataSource: MatTableDataSource<Assignment>,
    ) {}

    @Input() courseTeacherId: string = '';
    courseId = String(this.route.snapshot.paramMap.get('id'));
    userRole = this.sessionHandler.userRole;

    assignments: Assignment[] = [];
    columnsToDisplay = [
        {
            key: 'title',
            header: 'Name',
        },
        {
            key: 'due_date',
            header: 'Due Date',
        },
        {
            key: 'type',
            header: 'Type',
        },
        {
            key: 'points_possible',
            header: 'Points Possible',
        },
    ];

    columnsToDisplayWithExpand = [...this.columnsToDisplay.map(column => column.key), 'expand'];
    expandedAssignment = {} as Assignment;

    ngOnInit(): void {
        // Add to the columns for a student
        if (this.sessionHandler.userRole == 'student') {
            this.columnsToDisplay.push(
                {
                    key: 'grades.points_earned',
                    header: 'Points Earned',
                },
                {
                    key: 'letter_grade',
                    header: 'Grade',
                }
            );
            this.columnsToDisplayWithExpand = [...this.columnsToDisplay.map(column => column.key), 'expand'];
        }
        this.getAssignments();
    }

    getAssignments(): void {
        if (this.sessionHandler.userRole == 'student') {
            this.assignmentService.findAllForStudent(this.courseId, this.sessionHandler.userId)
                .subscribe(assignments => {
                    this.assignments = assignments;
                    this.getLetterGrades();
                    this.dataSource = new MatTableDataSource(this.assignments);
                });
        } else {
            this.assignmentService.findAll(this.courseId)
                .subscribe(assignments => {
                    this.assignments = assignments;
                    this.dataSource = new MatTableDataSource(assignments);
                });
        }

    }

    remove(id: string): void {
        this.assignmentService.remove(id)
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
                this.remove(id);
            }
        });
    }

    private getLetterGrades() {
        this.assignments.forEach(assignment => {
            if (assignment['grades.points_earned']) {
                const percentage = (assignment['grades.points_earned'] / assignment.points_possible) * 100;

                // As
                if (percentage >= 97) {
                    assignment.letter_grade = "A+";
                } else if (94 <= percentage && percentage < 97) {
                    assignment.letter_grade = "A";
                } else if (90 <= percentage && percentage < 94) {
                    assignment.letter_grade = "A-";
                }
                // Bs
                else if (87 <= percentage && percentage < 90) {
                    assignment.letter_grade = "B+";
                } else if (84 <= percentage && percentage < 87) {
                    assignment.letter_grade = "B";
                } else if (80 <= percentage && percentage < 84) {
                    assignment.letter_grade = "B-";
                }
                // Cs
                else if (77 <= percentage && percentage < 80) {
                    assignment.letter_grade = "C+";
                } else if (74 <= percentage && percentage < 77) {
                    assignment.letter_grade = "C";
                } else if (70 <= percentage && percentage < 74) {
                    assignment.letter_grade = "C-";
                }
                // Ds
                else if (67 <= percentage && percentage < 70) {
                    assignment.letter_grade = "D+";
                } else if (64 <= percentage && percentage < 67) {
                    assignment.letter_grade = "D";
                } else if (60 <= percentage && percentage < 64) {
                    assignment.letter_grade = "D-";
                }
                // F
                else {
                    assignment.letter_grade = "F";
                }
            }
        });
    }
}
