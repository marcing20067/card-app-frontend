import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { newUser } from './newUser.model';
import { User } from '../shared/models/user.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  authForm!: FormGroup;
  isLoginRoute!: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoginRoute = this.route.snapshot.url[0].path === 'login';

    if (this.isLoginRoute) {
      this.authForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    } else {
      this.authForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        repeatPassword: ['', Validators.required],
      });
    }
  }

  onSubmit() {
    const user = this.authForm.value;
    if (this.isLoginRoute) {
      this.authService.login(user as User).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/sets']);
        },
      });
    } else {
      this.authService.signup(user as newUser).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/auth/login']);
        },
      });
    }
  }
}
