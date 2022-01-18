import { Component } from '@angular/core';
import { Form } from '../../shared/util/form';
import { LoginData } from './login-data.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent extends Form<LoginData> {
  constructor() {
    super();
  }
}
