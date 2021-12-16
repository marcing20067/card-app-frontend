import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnDestroy {
  authForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false, Validators.required],
  });
  isLoginRoute!: boolean;
  signupSuccessfully = false;
  isSimilar = false;
  formSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.isLoginRoute = this.route.snapshot.url[0].path === 'login';

    if (!this.isLoginRoute) {
      this.authForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        repeatPassword: ['', Validators.required],
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
    const data = this.authForm.value;

    if (this.isLoginRoute) {
      const rememberMe = data.rememberMe;
      this.authService.login(data, rememberMe).subscribe();
    } else {
      this.authService.signup(data).subscribe(() => {
        this.signupSuccessfully = true;
      });
    }
  }

  ngOnDestroy() {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }
}
