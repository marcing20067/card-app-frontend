import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ResetPasswordData } from './shared/reset-password-data.model';
import { ResetUsernameData } from './shared/reset-username-data.model';
import { ResetService } from './shared/reset.service';
import { UserValidators } from '../shared/util/user-validators';

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
    private resetService: ResetService,
    private fb: NonNullableFormBuilder
  ) {
    this.mode = this.route.snapshot.url[0].path;
    if (this.mode === 'username') {
      this.form = this.fb.group({
        newUsername: ['', UserValidators.username],
      });
    }

    if (this.mode === 'password') {
      this.form = this.fb.group({
        newPassword: ['', UserValidators.password],
        repeatNewPassword: ['', UserValidators.repeatPassword],
      });
    }
  }

  onSubmit(data: ResetPasswordData | ResetUsernameData) {
    this.isLoading = true;
    const token = this.route.snapshot.params.token as string;
    const mode = this.mode as 'username' | 'password';
    this.resetService
      .resetWithToken(mode, token, data)
      .pipe(take(1))
      .subscribe({
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 409) {
            this.setAlreadyTakenErrorOnUsername();
          }
        },
      });
  }

  private setAlreadyTakenErrorOnUsername() {
    setTimeout(() => {
      this.form.controls.newUsername.setErrors({ alreadyTaken: true });
    }, 0);
  }
}
