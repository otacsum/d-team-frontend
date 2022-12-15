import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {Person} from '../interfaces/person.interface';
import {PeopleService} from '../people/people.service';

@Component({
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html',
    styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent {

    constructor(
        private route: ActivatedRoute,
        private peopleService: PeopleService,
        private location: Location,
    ) {}

    ngOnInit(): void {
        this.getPerson();
    }

    @Input() person?: Person;

    getPerson(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.peopleService.getPerson(id)
            .subscribe(person => this.person = person);
    }

    goBack(): void {
        this.location.back();
    }

}
