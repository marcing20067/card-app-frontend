import { Component } from '@angular/core';
import { Form } from '../../../shared/util/dummy-form';
import { LoginForm } from './login-form';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent extends Form<LoginForm> {
  constructor() {
    super();
  }
}
