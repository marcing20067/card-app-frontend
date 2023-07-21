import { Component } from '@angular/core';
import {NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthValidators } from 'src/app/shared/util/user-validators';
import { LoginData } from './login-form/login-data.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;

  form = this.fb.group({
    username: ['', AuthValidators.username],
    password: ['', AuthValidators.password],
    rememberMe: [false, Validators.required],
  });

  constructor(private fb: NonNullableFormBuilder, private authService: AuthService) {}

  onSubmit(data: LoginData) {
    this.authService
    .login(data, data.rememberMe)
    .pipe(take(1))
    .subscribe({
      error: () => {
        this.isLoading = false;
        this.setFormError({ loginFailed: true });
      },
    });
  }

  private setFormError(error: ValidationErrors, controlName?: string) {
    setTimeout(() => {
      if (controlName) {
        this.form.get(controlName)!.setErrors(error);
        return;
      }
      this.form.setErrors(error);
    }, 0);
  }
}
