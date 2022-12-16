import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {Login} from '../interfaces/login.interface';
import {LoginService} from './login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})


export class LoginComponent {

    constructor(
        private loginService: LoginService,
        private router: Router,
    ) {}

    login = {} as Login;

    isError: boolean = false;

    hidePassword = true;

    email = new FormControl('', [Validators.required, Validators.email]);

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'You must enter a value';
        }

        return this.email.hasError('email') ? 'Not a valid email' : '';
    }

    submit(): void {
        if (this.login) {
            this.loginService.login(this.login)
                .subscribe(result => {
                    if (result.success) {
                        this.isError = false;
                        this.router.navigate(['/']);
                    } else {
                        this.isError = true;
                    }
                });
        }
    }
}
