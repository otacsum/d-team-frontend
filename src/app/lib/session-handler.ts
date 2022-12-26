import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class SessionHandler {
    loggedIn = false;
    userId: string = '';
    userRole: string = 'guest';

    constructor() {
        if (!sessionStorage.getItem('loggedIn')) {
            sessionStorage.setItem('loggedIn', 'false');
        } else if (sessionStorage.getItem('loggedIn') == 'true') {
            this.loggedIn = true;
            this.userId = sessionStorage.getItem('userId') || '';
            this.userRole = sessionStorage.getItem('userRole') || 'guest';
        }
    }

    logOut() {
        this.loggedIn = false;
        sessionStorage.setItem('loggedIn', 'false');
        sessionStorage.setItem('userId', '');
        sessionStorage.setItem('userRole', 'guest');
        window.location.href = '/dashboard';
    }
}
