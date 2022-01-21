import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth/auth.service';
import { AuthValidators } from '../shared/util/user-validators';
import { LoginData } from './login-form/login-data.model';
import { SignupData } from './signup-form/signup-data.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  form!: FormGroup;
  isLoading = false;
  mode!: string;
  signupSuccessfully = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.mode = this.route.snapshot.url[0].path;

    if (this.mode === 'signup') {
      this.form = this.fb.group({
        username: ['', AuthValidators.username],
        password: ['', AuthValidators.password],
        email: ['', AuthValidators.email],
        repeatPassword: ['', AuthValidators.repeatPassword],
      });
    }

    if (this.mode === 'login') {
      this.form = this.fb.group({
        username: ['', AuthValidators.username],
        password: ['', AuthValidators.password],
        rememberMe: [false, Validators.required],
      });
    }
  }

  onSubmit(data: LoginData | SignupData) {
    this.isLoading = true;
    if (this.mode === 'login') {
      const loginData = data as LoginData;
      this.authService
        .login(loginData, loginData.rememberMe)
        .pipe(take(1))
        .subscribe({
          error: () => {
            this.isLoading = false;
            this.setFormError({ loginfailed: true });
          },
        });
    }

    if (this.mode === 'signup') {
      const signupData = data as SignupData;
      this.authService
        .signup(signupData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.signupSuccessfully = true;
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            if (err.status === 409) {
              const message = err.error.message.toLowerCase();
              const takenProperty = message.includes('username')
                ? 'username'
                : 'email';
              this.setFormError({ alreadytaken: true }, takenProperty);
            }
          },
        });
    }
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
