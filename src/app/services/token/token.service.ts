import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {

  }
  set token(token:string){
    console.log('Setting token:', token);
    localStorage.setItem('token',token);
  }
  get token(): string | null {
    return localStorage.getItem('token');
  }
}
