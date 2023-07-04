import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthValidators } from '../shared/util/user-validators';
import { ResetPasswordData } from './reset-password-form/reset-password-data.model';
import { ResetUsernameData } from './reset-username-form/reset-username-data.model';
import { ResetService } from './reset.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
// TODO: USE TYPED FORM
export class ResetComponent {
  form!: UntypedFormGroup;
  mode!: string;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private resetService: ResetService,
    private fb: UntypedFormBuilder
  ) {
    this.mode = this.route.snapshot.url[0].path;
    if (this.mode === 'username') {
      this.form = this.fb.group({
        newUsername: ['', AuthValidators.username],
      });
    }

    if (this.mode === 'password') {
      this.form = this.fb.group({
        newPassword: ['', AuthValidators.password],
        repeatNewPassword: ['', AuthValidators.repeatPassword],
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
            setTimeout(() => {
              this.setAlreadyTakenErrorOnUsername();
            }, 0);
          }
        },
      });
  }

  setAlreadyTakenErrorOnUsername() {
    // TODO: inconsistent naming
    setTimeout(() => {
      this.form.get('newUsername')!.setErrors({ alreadyTaken: true });
    }, 0);
  }
}
