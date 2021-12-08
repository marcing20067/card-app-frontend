import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  authForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false, Validators.required],
  });
  isLoginRoute!: boolean;

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
    }
  }

  onSubmit() {
    const data = this.authForm.value;

    if (this.isLoginRoute) {
      const rememberMe = data.rememberMe;

      this.authService.login(data, rememberMe).subscribe();
    } else {
      this.authService.signup(data).subscribe();
    }
  }
}
