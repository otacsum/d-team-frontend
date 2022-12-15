import {Component} from '@angular/core';

import {Person} from '../interfaces/person.interface';
import {PeopleService} from './people.service';


@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.css']
})

export class PeopleComponent {

    constructor(
        private peopleService: PeopleService,
    ) {}

    people: Person[] = [];

    ngOnInit(): void {
        this.getPeople();
    }

    getPeople(): void {
        this.peopleService.getPeople()
            .subscribe(people => this.people = people);
    }
}
