import { Component } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SignupData } from '../shared/signup-data.model';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { setFormError } from 'src/app/shared/util/set-form-error';
import { UserValidators } from 'src/app/shared/util/user-validators';
import { SignupForm } from '../shared/signup-form';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupSuccessfully = false;
  isLoading = false;

  form: FormGroup<SignupForm> = this.fb.group({
    username: ['', UserValidators.username],
    password: ['', UserValidators.password],
    email: ['', UserValidators.email],
    repeatPassword: ['', UserValidators.repeatPassword],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService
  ) {}

  onSubmit(data: SignupData) {
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

            setFormError(
              this.form,
              { alreadyTaken: true },
              takenProperty
            );
          }
        },
      });
  }
}
