import {Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
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
        private fb: FormBuilder,
    ) {}

    login = {} as Login;

    isError: boolean = false;

    hidePassword = true;

    loginForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
    });

    submit(): void {
        if (this.login) {
            this.loginService.login(this.login)
                .subscribe(result => {
                    if (result.success) {
                        this.isError = false;
                        //this.router.navigate(['/dashboard']);
                        window.location.href = '/dashboard';
                    } else {
                        this.isError = true;
                    }
                });
        }
    }
}
