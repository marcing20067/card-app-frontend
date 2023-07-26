import { Component } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthValidators } from 'src/app/shared/util/user-validators';
import { LoginData } from './login-form/login-data.model';
import { take } from 'rxjs/operators';
import { LoginForm } from './login-form/login-form';
import { setFormError } from 'src/app/shared/util/set-form-error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;
  form: FormGroup<LoginForm> = this.fb.group({
    username: ['', AuthValidators.username],
    password: ['', AuthValidators.password],
    rememberMe: [false, Validators.required],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService
  ) {}

  onSubmit(data: LoginData) {
    this.authService
      .login(data, data.rememberMe)
      .pipe(take(1))
      .subscribe({
        error: () => {
          this.isLoading = false;
          setFormError(this.form, { loginFailed: true });
        },
      });
  }
}
