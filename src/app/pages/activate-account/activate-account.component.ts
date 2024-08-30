import { Component } from '@angular/core';
import {AuthenticationService} from "../../services/services/authentication.service";
import {Router} from "@angular/router";
import {CodeInputModule} from "angular-code-input";
import {NgIf} from "@angular/common";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    CodeInputModule,
    NgIf
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {
  message: string = '';
  isOkay: boolean=true;
  submitted: boolean=false;

  constructor(
    private router: Router,
    private authService : AuthenticationService
  ) {}

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next:():void=>{
        this.message='Your account has been successfully activated\n Now you can proceed to login';
        this.submitted= true;
        this.isOkay=true;
    },
      error:(err):void=>{
        this.message='Token has been expired or invalid';
        this.submitted= true;
        this.isOkay=false;
      }
    })
    }

  redirectLogin() {
    this.router.navigate(['login']);
  }
}
