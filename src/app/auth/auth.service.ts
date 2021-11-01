import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { newUser } from './newUser.model';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenData$ = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post(environment.BACKEND_URL + 'login', user);
  }

  signup(user: newUser) {
    return this.http.post(environment.BACKEND_URL + 'signup', user);
  }
}
