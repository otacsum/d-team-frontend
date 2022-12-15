import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Login} from '../interfaces/login.interface';
import {LoginService} from './login.service';
import {Router} from '@angular/router';

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
