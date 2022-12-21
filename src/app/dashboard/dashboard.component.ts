import { Component, OnInit } from '@angular/core';

import { Person } from '../interfaces/person.interface';
import { PersonService } from '../people/person.service';
import {Course} from '../interfaces/course.interface';
import {CourseService} from '../courses/course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})

export class DashboardComponent implements OnInit {

  people: Person[] = [];
  courses: Course[] = [];

  constructor(
    private peopleService: PersonService,
    private courseService: CourseService,
    ) { }

  ngOnInit(): void {
    //this.getPeople();
    this.getCourses();
  }

  getPeople(): void {
    this.peopleService.findAll()
      .subscribe(people => this.people = people.slice(1, 3));
  }

  getCourses(): void {
    this.courseService.findAll()
      .subscribe(courses => this.courses = courses.slice(0, 4));
  }
}
