import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AuthValidators } from 'src/app/shared/util/user-validators';
import { SignupData } from './signup-form/signup-data.model';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { SignupForm } from './signup-form/signup-form';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupSuccessfully = false;
  isLoading = false;

  form: FormGroup<SignupForm> = this.fb.group({
    username: ['', AuthValidators.username],
    password: ['', AuthValidators.password],
    email: ['', AuthValidators.email],
    repeatPassword: ['', AuthValidators.repeatPassword],
  });

  constructor(private fb: NonNullableFormBuilder, private authService: AuthService) {}

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
          this.setFormError({ alreadyTaken: true }, takenProperty);
        }
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
