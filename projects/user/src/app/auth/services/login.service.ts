import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateAccount, Login } from '../constant/DTOs';
import { environment } from 'projects/user/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  /* Login User Account Process */
  createUser(model: CreateAccount) {
    return this.http.post(environment.baseApi.replace('tasks', 'auth') + '/createAccount', model)
  }

  /* Login process */
  login(model: Login) {
    return this.http.post(environment.baseApi.replace('tasks', 'auth') + '/login', model)
  }

}
