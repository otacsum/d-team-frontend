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
    title = 'L.A. Unified School District';
}
