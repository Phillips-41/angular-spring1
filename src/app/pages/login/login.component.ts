import { Component, OnInit } from '@angular/core';
import {AuthenticationRequest} from "../../services/models/authentication-request";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/services/authentication.service";
import {AuthenticationResponse} from "../../services/models/authentication-response";
import {TokenService} from "../../services/token/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,CommonModule
  ],
  standalone: true
})
export class LoginComponent implements OnInit {
  constructor(
    private router : Router,
    private authService : AuthenticationService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {}
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res: any): void => {
        // if (res instanceof Blob) {
        //   // If the response is a Blob, manually convert it to JSON
        //   res.text().then(text => {
        //     const data = JSON.parse(text);
        //     console.log('Converted Response:', data);
        //     const token = data.token;
        //     console.log('Received token:', token);
        //     this.tokenService.token = token as string;
        //     this.router.navigate(['books']);
        //   });
        console.log(res);
        this.tokenService.token = res.token as string;
        this.router.navigate(['books']);

        // } else {
        //   const token = res.token;
        //   console.log('Received token:', token);
        //   this.tokenService.token = token as string;
        //   this.router.navigate(['books']);
        // }
      },
      error: (err:any): void => {
        console.log('Error occurred:', err);
        if (err.error && err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    });
  }


  register() {
    this.router.navigate(['register']);
  }
}
