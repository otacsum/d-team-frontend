import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Login} from '../interfaces/login.interface';
import {Success} from '../interfaces/success.interface';
import {MessageHandler} from '../lib/message-handler';

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    constructor(
        private messageHandler: MessageHandler,
        private http: HttpClient,
    ) {}

    private loginUrl = Environment.apiBaseUrl + '/person/login';

    login(login: Login): Observable<Success> {
        return this.http.post<Success>(this.loginUrl, login)
            .pipe(
                tap((loginSuccess: Success) => {
                    this.messageHandler
                        .log(`LoginService: ${login.email} credentials sent`);
                    this.messageHandler
                        .log(`LoginService: Credentials Valid: ${loginSuccess.success}`);

                    if (loginSuccess.person && loginSuccess.person.is_active) {
                        sessionStorage.setItem('loggedIn', `${loginSuccess.success}`);
                        sessionStorage.setItem('userId', `${loginSuccess.person.id}`);
                        sessionStorage.setItem('userRole', `${loginSuccess.person.type}`);
                    }

                }),
                catchError(this.messageHandler.handleError<Success>('LoginService: error'))
            );
    }
}
