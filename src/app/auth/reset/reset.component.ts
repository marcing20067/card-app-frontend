import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import * as AuthValidators from '../validators';
import { ResetPasswordData } from './reset-password-form/reset-password-data.model';
import { ResetUsernameData } from './reset-username-form/reset-username-data.model';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  form!: FormGroup;
  mode!: string;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.mode = this.route.snapshot.url[1].path;
    if (this.mode === 'username') {
      this.form = this.fb.group({
        newUsername: ['', AuthValidators.username],
      });
    }

    if (this.mode === 'password') {
      this.fb.group({
        newPassword: ['', AuthValidators.password],
        repeatNewPassword: ['', AuthValidators.repeatPassword],
      });
    }
  }

  onSubmit(data: ResetPasswordData | ResetUsernameData) {
    this.isLoading = true;
    const token = this.route.snapshot.params.token as string;
    const mode = this.mode as 'username' | 'password';
    this.authService
      .resetWithToken(mode, token, data)
      .pipe(take(1))
      .subscribe({
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 409) {
            setTimeout(() => {
              this.setAlreadyTakenErrorOnUsername();
            }, 0);
          }
        },
      });
  }

  setAlreadyTakenErrorOnUsername() {
    setTimeout(() => {
      this.form.get('username')!.setErrors({ alreadyTaken: true });
    }, 0)
  }
}
