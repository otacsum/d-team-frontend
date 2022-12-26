import {Component} from '@angular/core';

import {MessageService} from './message.service';
import { SessionHandler } from '../lib/session-handler';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})

export class MessagesComponent {
    constructor(
        public messageService: MessageService,
        public sessionHandler: SessionHandler
    ) {}

}
