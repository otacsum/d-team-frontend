import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";

import { Assignment } from '../interfaces/assignment.interface';
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

    courseId = String(this.route.snapshot.paramMap.get('id'));

    assignments: Assignment[] = [];
    displayedColumns: string[] = ['type', 'title', 'points_possible', 'due_date', 'actions'];

    ngOnInit(): void {
        this.getCredentials();
    }

    getCredentials(): void {
        this.assignmentService.findAll(this.courseId)
            .subscribe(assignments => {
                this.assignments = assignments;
                this.dataSource = new MatTableDataSource(assignments);
            });
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
}
