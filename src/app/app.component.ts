import {Component} from '@angular/core';
import {SessionHandler} from './lib/session-handler';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    constructor(
        public sessionHandler: SessionHandler,
    ) {}

    title = 'Los Angeles Unified School District';
    subtitle = 'Education Management System';
}
