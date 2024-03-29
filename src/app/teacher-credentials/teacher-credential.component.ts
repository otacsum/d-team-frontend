import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";

import {TeacherCredential} from '../interfaces/teacher-credential.interface';
import {TeacherCredentialService} from './teacher-credential.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {SessionHandler} from '../lib/session-handler';




@Component({
    selector: 'app-teacher-credential',
    templateUrl: './teacher-credential.component.html',
    styleUrls: ['./teacher-credential.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class TeacherCredentialComponent {

    constructor(
        private teacherCredentialService: TeacherCredentialService,
        public dialog: MatDialog,
        public sessionHandler: SessionHandler,
        public dataSource: MatTableDataSource<TeacherCredential>,
    ) {}

    @Input() teacherId = '';

    credentials: TeacherCredential[] = [];
    columnsToDisplay = [
        {
            key: 'job_title',
            header: 'Name',
        },
        {
            key: 'rank',
            header: 'Type',
        },
        {
            key: 'credential_type',
            header: 'Category',
        },
        {
            key: 'subject_abbreviation',
            header: 'Subject Field',
        }
    ];

    columnsToDisplayWithExpand = [...this.columnsToDisplay.map(column => column.key), 'expand'];
    expandedCredential = {} as TeacherCredential;

    ngOnInit(): void {
        this.getCredentials();
    }

    getCredentials(): void {
        this.teacherCredentialService.findAll(this.teacherId)
            .subscribe(credentials => {
                this.credentials = credentials;
                this.dataSource = new MatTableDataSource(credentials);
            });
    }

    remove(id: string): void {
        this.teacherCredentialService.remove(id)
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
