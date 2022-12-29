import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";

import {Person} from '../interfaces/person.interface';
import {PersonService} from './person.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {SessionHandler} from '../lib/session-handler';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class PeopleComponent {

    constructor(
        private personService: PersonService,
        public dialog: MatDialog,
        public sessionHandler: SessionHandler,
        public dataSource: MatTableDataSource<Person>,
    ) {}

    people: Person[] = [];
    columnsToDisplay = [
        {
            key: 'first_name',
            header: 'First',
        },
        {
            key: 'last_name',
            header: 'Last',
        },
        {
            key: 'type',
            header: 'Role',
        }
    ];

    columnsToDisplayWithExpand = [...this.columnsToDisplay.map(column => column.key), 'expand'];
    expandedPerson = {} as Person;

    ngOnInit(): void {
        this.getPeople();
    }

    getPeople(): void {
        this.personService.findAll()
            .subscribe(people => {
                this.people = people;
                this.dataSource = new MatTableDataSource(people);
            });
    }

    removePerson(id: string): void {
        this.personService.removePerson(id)
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
                this.removePerson(id);
            }
        });
    }
}
