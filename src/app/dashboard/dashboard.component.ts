import { Component, OnInit } from '@angular/core';

import { Person } from '../interfaces/person.interface';
import { PeopleService } from '../people/people.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})

export class DashboardComponent implements OnInit {
  people: Person[] = [];

  constructor(private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.getPeople();
  }

  getPeople(): void {
    this.peopleService.getPeople()
      .subscribe(people => this.people = people.slice(1, 3));
  }
}
