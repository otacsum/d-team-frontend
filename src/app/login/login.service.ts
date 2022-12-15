import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Environment} from 'src/environment/environment';
import {Login} from '../interfaces/login.interface';
import {LoginSuccess} from '../interfaces/login-success.interface';
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

    login(login: Login): Observable<LoginSuccess> {
        return this.http.post<LoginSuccess>(this.loginUrl, login)
            .pipe(
                tap((loginSuccess: LoginSuccess) => {
                    this.messageHandler
                        .log(`LoginService: ${login.email} credentials sent`);
                    this.messageHandler
                        .log(`LoginService: Credentials Valid: ${loginSuccess.success}`);
                }),
                catchError(this.messageHandler.handleError<LoginSuccess>('LoginService: error'))
            );
    }
}
