import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../context/DTOs';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  /*   Login data Post from backend server */

  logIn(model: Login) {
    return this.http.post(environment.baseApi.replace('tasks', 'auth') + '/login', model)
  }


}
