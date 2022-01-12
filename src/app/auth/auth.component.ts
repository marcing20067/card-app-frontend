import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth/auth.service';
import * as AuthValidators from './validators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnDestroy {
  private formSub!: Subscription;
  isLoading = false;
  mode!: string;
  signupSuccessfully = false;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.mode = this.route.snapshot.url[0].path;

    if (this.mode === 'login') {
      this.authForm = this.fb.group({
        username: ['', AuthValidators.username],
        password: ['', AuthValidators.password],
        rememberMe: [false, Validators.required],
      });
    }

    if (this.mode === 'signup') {
      this.authForm = this.fb.group({
        username: ['', AuthValidators.username],
        password: ['', AuthValidators.password],
        email: ['', AuthValidators.email],
        repeatPassword: ['', AuthValidators.repeatPassword],
      });

      this.formSub = this.authForm.valueChanges
        .pipe(
          distinctUntilChanged((prev, next) => {
            return (
              prev.repeatPassword === next.repeatPassword &&
              prev.password === next.password
            );
          })
        )
        .subscribe((value) => {
          const isSimilar = value.password === value.repeatPassword;
          this.authForm
            .get('repeatPassword')
            ?.setErrors(isSimilar ? null : { similar: 'false' });
        });
    }
  }

  onSubmit() {
    this.isLoading = true;
    const data = this.authForm.value;
    if (this.mode === 'login') {
      this.authService
        .login(data, data.rememberMe)
        .pipe(take(1))
        .subscribe({
          error: () => {
            this.isLoading = false;
          },
        });
    }

    if (this.mode === 'signup') {
      this.authService
        .signup(data)
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
              setTimeout(() => {
                this.authForm
                  .get(takenProperty)
                  ?.setErrors({ alreadyTaken: true });
              }, 0);
            }
          },
        });
    }
  }

  ngOnDestroy() {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }
}
