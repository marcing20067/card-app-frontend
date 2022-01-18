import { Component } from '@angular/core';
import { AuthForm } from '../auth-form';
import { LoginData } from './login-data.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent extends AuthForm<LoginData> {
  constructor() {
    super();
  }
}
