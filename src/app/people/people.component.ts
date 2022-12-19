import {Component, Inject} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

import {Person} from '../interfaces/person.interface';
import {PersonService} from './person.service';
import {ConfirmDeleteComponent} from '../confirm-delete/confirm-delete.component';
import {MatTableDataSource} from '@angular/material/table';




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
        public dialog: MatDialog
    ) {}
    
    people: Person[] = [];
    columnsToDisplay = ['first_name', 'last_name', 'type'];
    columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    expandedPerson = {} as Person;
    dataSource = {} as MatTableDataSource<Person>;

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
                this.removePerson(id);
            }
        });
    }
}
