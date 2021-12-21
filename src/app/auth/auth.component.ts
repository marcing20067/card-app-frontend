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
  mode!: string;
  isLoading = false;
  authForm!: FormGroup;
  signupSuccessfully = false;
  isSimilar = false;
  formSub!: Subscription;

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
          this.isSimilar = value.password === value.repeatPassword;
        });
    }
  }

  onSubmit() {
    this.isLoading = true;
    const data = this.authForm.value;
    if (this.mode === 'login') {
      const rememberMe = data.rememberMe;
      this.authService
        .login(data, rememberMe)
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
          error: () => {
            this.isLoading = false;
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
