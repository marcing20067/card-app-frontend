import { Component } from '@angular/core';
import { SimpleForm } from '../../../shared/util/simple-form';
import { LoginForm } from './login-form';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent extends SimpleForm<LoginForm> {
  constructor() {
    super();
  }
}
