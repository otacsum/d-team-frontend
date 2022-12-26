import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {TeacherCredential} from 'src/app/interfaces/teacher-credential.interface';
import {Person} from '../../interfaces/person.interface';
import {TeacherCredentialService} from '../teacher-credential.service';
import {MessageHandler} from '../../lib/message-handler';
import {SessionHandler} from '../../lib/session-handler';

@Component({
    selector: 'teacher-credential-detail',
    templateUrl: './teacher-credential-detail.component.html',
    styleUrls: ['./teacher-credential-detail.component.css']
})
export class TeacherCredentialDetailComponent {

    constructor(
        private route: ActivatedRoute,
        private teacherCredentialService: TeacherCredentialService,
        private location: Location,
        private fb: FormBuilder,
        private messageHandler: MessageHandler,
        public sessionHandler: SessionHandler,
        private router: Router,
    ) {}


    isNewCredential = (this.router.url == '/teacher/credential/create');

    credentialForm = this.fb.group({
        jobTitle: [null, Validators.required],
        rank: [null, Validators.required],
        credentialType: [null, Validators.required],
        subjectAbbreviation: [null, Validators.required],
    });    

    subjects = [
        {name: 'Chemistry & Bio-Chemistry', abbreviation: 'CHEM'},
        {name: 'Computer Science & Engineering', abbreviation: 'CSE'},
        {name: 'Economics', abbreviation: 'ECON'},
        {name: 'History', abbreviation: 'HIST'},
        {name: 'Literature & Language Arts', abbreviation: 'LIT'},
        {name: 'Mathematics', abbreviation: 'MATH'},
        {name: 'Music Theory & Performance', abbreviation: 'MUS'},
        {name: 'Physics', abbreviation: 'PHYS'},
    ];

    types = [
        'Academic Degree',
        'Certification',
        'Job Rank',
        'Other'
    ]

    ngOnInit(): void {
        if (!this.isNewCredential) {
            this.getCredential();
        }
        this.messageHandler
            .log(`Router.URL: ${this.router.url}`);
    }

    @Input() credential = {} as TeacherCredential;

    getCredential(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.teacherCredentialService.findOne(id)
            .subscribe(credential => this.credential = credential);
    }

    goBack(): void {
        this.location.back();
    }

    submit(): void {
        const id = String(this.route.snapshot.paramMap.get('id'));
        if (this.isNewCredential) {
            this.credential.person_id = this.sessionHandler.userId;
            this.teacherCredentialService.create(this.credential)
                .subscribe(result => {
                    if (result.success) {
                        this.messageHandler
                            .log(`Create Credential: Success, redirecting to all credentials.`);
                        this.router.navigate(['/teacher/credential']);
                    } else {
                        this.messageHandler
                            .log(`Create Credential: Error: ${result.message}`);
                    }
                });
        } else {
            this.teacherCredentialService.update(id, this.credential)
                .subscribe(result => {
                    if (result.success) {
                        this.messageHandler
                            .log(`Update Credential: Successful Update, redirecting to all credentials.`);
                        this.router.navigate(['/teacher/credential']);
                    } else {
                        this.messageHandler
                            .log(`Update Credential: Error: ${result.message}`);
                    }
                });
        }

    }

}
