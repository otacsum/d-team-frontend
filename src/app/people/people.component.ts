import {Component} from '@angular/core';

import {Person} from '../interfaces/person.interface';
import {PeopleService} from './people.service';
import {MessageService} from '../messages/message.service';


@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.css']
})

export class PeopleComponent {

    constructor(
        private messageService: MessageService,
        private peopleService: PeopleService,
    ) {}

    people: Person[] = [];
    selectedPerson?: Person;

    ngOnInit(): void {
        this.getPeople();
    }

    getPeople(): void {
        this.peopleService.getPeople()
            .subscribe(people => this.people = people);
    }

    onSelect(person: Person): void {
        this.selectedPerson = person;
        this.messageService.add(
            `PeopleComponent: Selected person id=${person.id}`
        );
    }
}
