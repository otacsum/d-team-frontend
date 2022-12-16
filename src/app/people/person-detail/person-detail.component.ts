import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

import {Person} from '../../interfaces/person.interface';
import {PeopleService} from '../people.service';
import { MessageHandler } from '../../lib/message-handler';

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
        private fb: FormBuilder,
        private messageHandler: MessageHandler,
    ) {}


    personForm = this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        address: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        postalCode: [null, Validators.compose([
            Validators.required, Validators.minLength(5), Validators.maxLength(5)])
        ],
        role: ['student', Validators.required]
    });

    states = [
        {name: 'Alabama', abbreviation: 'AL'},
        {name: 'Alaska', abbreviation: 'AK'},
        {name: 'American Samoa', abbreviation: 'AS'},
        {name: 'Arizona', abbreviation: 'AZ'},
        {name: 'Arkansas', abbreviation: 'AR'},
        {name: 'California', abbreviation: 'CA'},
        {name: 'Colorado', abbreviation: 'CO'},
        {name: 'Connecticut', abbreviation: 'CT'},
        {name: 'Delaware', abbreviation: 'DE'},
        {name: 'District Of Columbia', abbreviation: 'DC'},
        {name: 'Federated States Of Micronesia', abbreviation: 'FM'},
        {name: 'Florida', abbreviation: 'FL'},
        {name: 'Georgia', abbreviation: 'GA'},
        {name: 'Guam', abbreviation: 'GU'},
        {name: 'Hawaii', abbreviation: 'HI'},
        {name: 'Idaho', abbreviation: 'ID'},
        {name: 'Illinois', abbreviation: 'IL'},
        {name: 'Indiana', abbreviation: 'IN'},
        {name: 'Iowa', abbreviation: 'IA'},
        {name: 'Kansas', abbreviation: 'KS'},
        {name: 'Kentucky', abbreviation: 'KY'},
        {name: 'Louisiana', abbreviation: 'LA'},
        {name: 'Maine', abbreviation: 'ME'},
        {name: 'Marshall Islands', abbreviation: 'MH'},
        {name: 'Maryland', abbreviation: 'MD'},
        {name: 'Massachusetts', abbreviation: 'MA'},
        {name: 'Michigan', abbreviation: 'MI'},
        {name: 'Minnesota', abbreviation: 'MN'},
        {name: 'Mississippi', abbreviation: 'MS'},
        {name: 'Missouri', abbreviation: 'MO'},
        {name: 'Montana', abbreviation: 'MT'},
        {name: 'Nebraska', abbreviation: 'NE'},
        {name: 'Nevada', abbreviation: 'NV'},
        {name: 'New Hampshire', abbreviation: 'NH'},
        {name: 'New Jersey', abbreviation: 'NJ'},
        {name: 'New Mexico', abbreviation: 'NM'},
        {name: 'New York', abbreviation: 'NY'},
        {name: 'North Carolina', abbreviation: 'NC'},
        {name: 'North Dakota', abbreviation: 'ND'},
        {name: 'Northern Mariana Islands', abbreviation: 'MP'},
        {name: 'Ohio', abbreviation: 'OH'},
        {name: 'Oklahoma', abbreviation: 'OK'},
        {name: 'Oregon', abbreviation: 'OR'},
        {name: 'Palau', abbreviation: 'PW'},
        {name: 'Pennsylvania', abbreviation: 'PA'},
        {name: 'Puerto Rico', abbreviation: 'PR'},
        {name: 'Rhode Island', abbreviation: 'RI'},
        {name: 'South Carolina', abbreviation: 'SC'},
        {name: 'South Dakota', abbreviation: 'SD'},
        {name: 'Tennessee', abbreviation: 'TN'},
        {name: 'Texas', abbreviation: 'TX'},
        {name: 'Utah', abbreviation: 'UT'},
        {name: 'Vermont', abbreviation: 'VT'},
        {name: 'Virgin Islands', abbreviation: 'VI'},
        {name: 'Virginia', abbreviation: 'VA'},
        {name: 'Washington', abbreviation: 'WA'},
        {name: 'West Virginia', abbreviation: 'WV'},
        {name: 'Wisconsin', abbreviation: 'WI'},
        {name: 'Wyoming', abbreviation: 'WY'}
    ];

    ngOnInit(): void {
        this.getPerson();
    }

    @Input() person = {} as Person;

    getPerson(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.peopleService.getPerson(id)
            .subscribe(person => this.person = person);
    }

    goBack(): void {
        this.location.back();
    }

    onSubmit(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.peopleService.updatePerson(id, this.person)
            .subscribe(result => {
                if (!result.success) {
                    this.messageHandler
                    .log(`Update Person: Message: ${result.message}`);
                }
            });
    }

}