import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {Person} from '../interfaces/person.interface';
import {PersonService} from './person.service';


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
        private peopleService: PersonService,
    ) {}

    people: Person[] = [];
    columnsToDisplay = ['first_name', 'last_name', 'type'];
    columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    expandedPerson = {} as Person;

    ngOnInit(): void {
        this.getPeople();
    }

    getPeople(): void {
        this.peopleService.findAll()
            .subscribe(people => this.people = people);
    }
}
