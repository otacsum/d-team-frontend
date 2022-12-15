import {Component, Input} from '@angular/core';
import {Person} from '../interfaces/person.interface';

@Component({
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html',
    styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent {

    @Input() person?: Person;

}
